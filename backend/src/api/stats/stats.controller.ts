import { StatsFunctions } from './stats.functions'
import { StatsService } from './stats.service'
import { ExamsService } from 'api/exams/exams.service'
import { ModelsService } from 'api/models/models.service'
import { CategoriesService } from 'api/categories/categories.service'
import { NotFoundException } from 'exceptions'
import { ProgressService } from 'api/progress/progress.service'
import { Bind } from 'decorators'
import { Logger } from 'api/logger'
import { Categories } from 'metadata/categories'
import { Models } from 'metadata/models'
import type { Request, Response } from 'express'

const CATEGORY_COLORS: Record<string, string> = {
  [Categories.Core]: 'rgba(99, 102, 241, 1)',
  [Categories.Listening]: 'rgba(59, 130, 246, 1)',
  [Categories.Reading]: 'rgba(16, 185, 129, 1)',
  [Categories.Writing]: 'rgba(245, 158, 11, 1)',
  [Categories.Speaking]: 'rgba(239, 68, 68, 1)',
}

const CEFR_LABELS: Record<string, string> = {
  'C1': 'C1 · Advanced',
  'B2': 'B2 · Upper Intermediate',
  'B1': 'B1 · Intermediate',
  'A2': 'A2 · Elementary',
  'A1': 'A1 · Beginner',
}

interface StatRecord {
  examId: number
  categoryId: number
  points?: number
  bandScore?: number
  category?: { name: string }
  [key: string]: unknown
}

class StatsController {
  private statsService: StatsService
  private examsService: ExamsService
  private categoriesService: CategoriesService
  private progressService: ProgressService
  private modelService: ModelsService
  private logger: typeof Logger.Service

  constructor() {
    this.statsService = new StatsService()
    this.examsService = new ExamsService()
    this.categoriesService = new CategoriesService()
    this.progressService = new ProgressService()
    this.modelService = new ModelsService()
    this.logger = Logger.Service
  }

  @Bind
  async getAll(req: Request, res: Response): Promise<Response> {
    const model = await this.modelService.getOne({
      name: req.query.model
    })

    if (model) {
      this.logger.info('Model', model.name)

      const ids = await this.examsService.getAll({
        modelId: model.id,
        getIds: true
      })

      const categories = await Promise.all(
        [
          Categories.Core,
          Categories.Listening,
          Categories.Reading,
          Categories.Writing,
          Categories.Speaking
        ].map(name =>
          this.categoriesService.getOne({
            name
          })
        )
      )

      const validCategories = categories.filter(Boolean)
      const examIdList = (ids as unknown as number[])
      const categoryIdList = validCategories.map(c => (c as unknown as Record<string, number>).id)

      const allStats = await this.statsService.batchGetAll(
        { examIds: examIdList, userId: req.user!.id, categoryIds: categoryIdList },
        { model: model.name }
      ) as unknown as StatRecord[]

      // Group stats by examId → then by categoryId
      const statsByExam = new Map<number, Map<number, StatRecord>>()
      for (const stat of (allStats || [])) {
        if (!statsByExam.has(stat.examId)) {
          statsByExam.set(stat.examId, new Map())
        }
        statsByExam.get(stat.examId)!.set(stat.categoryId, stat)
      }

      const examLabels = examIdList.map((_, i) => `Exam ${i + 1}`)
      const modelRef = model as unknown as { name: string }
      const labels = StatsFunctions.getLabels(modelRef)

      // Build per-category datasets
      const datasets: Record<string, unknown>[] = []

      for (const category of validCategories) {
        const catName = (category as unknown as Record<string, string>).name
        const catId = (category as unknown as Record<string, number>).id

        const data: (string | undefined)[] = examIdList.map(examId => {
          const examStats = statsByExam.get(examId)
          if (!examStats) return undefined

          const stat = examStats.get(catId)
          if (!stat) return undefined

          const value = model.name === Models.APTIS ? stat.points : stat.bandScore
          return StatsFunctions.getDataScore(modelRef, value ?? 0, catName)
        })

        datasets.push({
          label: catName,
          data,
          borderColor: CATEGORY_COLORS[catName] || 'rgba(107, 114, 128, 1)',
          backgroundColor: (CATEGORY_COLORS[catName] || 'rgba(107, 114, 128, 1)').replace('1)', '0.15)'),
          tension: 0.2,
          fill: false,
          spanGaps: true,
          borderWidth: 2,
        })
      }

      // Compute overall dataset (average across categories per exam)
      const overallData: (string | undefined)[] = examIdList.map(examId => {
        const examStats = statsByExam.get(examId)
        if (!examStats || examStats.size === 0) return undefined

        let total = 0
        let count = 0
        for (const stat of examStats.values()) {
          total += (model.name === Models.APTIS ? stat.points : stat.bandScore) ?? 0
          count++
        }

        if (count === 0) return undefined
        return StatsFunctions.getDataScore(modelRef, total / count, categories[0] as unknown as Record<string, string>['name'])
      })

      // Determine CEFR level from the latest overall
      const latestOverall = overallData.filter(Boolean).pop()
      let cefrLevel = 'N/A'
      let cefrLabel = 'No data yet'
      if (latestOverall && labels) {
        const idx = parseInt(latestOverall)
        const cefr = labels[idx]
        if (cefr && cefr !== 'N/A') {
          cefrLevel = cefr
          cefrLabel = CEFR_LABELS[cefr] || cefr
        }
      }

      // Compute best level
      let bestLevel = 'N/A'
      const validPoints = overallData.filter(Boolean) as string[]
      if (validPoints.length > 0 && labels) {
        const bestIdx = Math.max(...validPoints.map(d => parseInt(d)))
        bestLevel = labels[bestIdx] || 'N/A'
      }

      // Merge overall dataset as last
      datasets.push({
        label: 'Overall',
        data: overallData,
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.08)',
        borderWidth: 3,
        borderDash: [],
        tension: 0.2,
        fill: false,
        spanGaps: true,
      })

      return res.status(200).json({
        response: {
          cefr: cefrLevel,
          cefrLabel,
          chart: {
            labels: examLabels,
            datasets
          },
          labels,
          summary: {
            examsTaken: examIdList.length,
            latestLevel: cefrLevel,
            bestLevel
          }
        },
        statusCode: 200
      })
    }

    throw new NotFoundException(res.__('errors.Model Not Found'))
  }
}

export { StatsController }
