import { Logger } from 'api/logger'
import { AmazonWebServices } from './aws.service'
import { CloudStorageService } from 'api/cloudstorage/cloudstorage.service'
import { PackagesService } from 'api/packages/packages.service'
import { PaymentException } from 'exceptions'
import type { Request, Response } from 'express'
import type { AWSControllerOptions } from './aws.types'
import type MulterS3 from 'multer-s3'

class AWSController {
  private aws: AmazonWebServices
  private cloudStorageService: CloudStorageService
  private packagesService: PackagesService
  private logger: typeof Logger.Service
  private bucket: string

  constructor({ bucket }: AWSControllerOptions) {
    this.aws = new AmazonWebServices()
    this.cloudStorageService = new CloudStorageService()
    this.packagesService = new PackagesService()
    this.logger = Logger.Service
    this.bucket = bucket
  }

  async getFile(req: Request, res: Response): Promise<Response> {
    const { filename, bucket, key } = req.query as Record<string, string>

    const buffer = await this.aws.getObjectBody({
      Bucket: bucket || 'aptisgo',
      Key: key.concat('/', filename)
    })

    return res.status(200).json({
      message: 'File get succesfully',
      response: buffer.toString('base64'),
      statusCode: 200
    })
  }

  async uploadSpeaking(req: Request, res: Response): Promise<Response> {
    const user = req.user!

    const file = req.file as unknown as MulterS3.MulterS3File

    const subscription = await this.packagesService.getActiveSubscription({
      competence: 'speakings',
      userId: user.id
    })

    const isNotSubscribed = !subscription

    if (isNotSubscribed && req.query.feedback) {
      await this.aws.deleteObject({ Bucket: this.bucket, Key: file.Key })
      this.logger.info('Object Speaking deleted due to payment requirement.')
      throw new PaymentException()
    }

    const storage = await this.cloudStorageService.create({
      bucket: file.bucket,
      ETag: file.etag,
      key: file.key,
      location: file.location,
      userId: user.id
    })

    return res.status(201).json({
      messasge: 'Speaking uploaded succesfuly',
      storage,
      statusCode: 201
    })
  }
}

export { AWSController }
