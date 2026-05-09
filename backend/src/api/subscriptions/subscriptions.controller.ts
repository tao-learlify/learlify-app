import { Bind } from 'decorators'
import { NotFoundException } from 'exceptions'
import { SubscriptionsService } from './subscriptions.service'
import type { Request, Response } from 'express'

export class SubscriptionsController {
  private service: SubscriptionsService

  constructor() {
    this.service = new SubscriptionsService()
  }

  @Bind
  async getAll(req: Request, res: Response) {
    const user = req.user as { id: number }
    const data = await this.service.getActive(user.id)

    return res.status(200).json({
      response: data,
      statusCode: 200
    })
  }

  @Bind
  async create(req: Request, res: Response) {
    const user = req.user as { id: number }
    const {
      planPriceId,
      paymentMethodId,
      stripeToken,
      idempotencyKey
    } = req.body

    const subscription = await this.service.create({
      userId: user.id,
      planPriceId: parseInt(planPriceId),
      paymentMethodId,
      stripeToken,
      idempotencyKey
    })

    return res.status(201).json({
      message: 'Subscription created successfully',
      response: subscription,
      statusCode: 201
    })
  }

  @Bind
  async cancel(req: Request, res: Response) {
    const user = req.user as { id: number }
    const subscriptionId = parseInt(req.params.id)
    const { immediately } = req.body

    const subscription = await this.service.getOne(subscriptionId, user.id)

    if (!subscription) {
      throw new NotFoundException('Subscription not found')
    }

    const updated = await this.service.cancel({
      subscriptionId,
      userId: user.id,
      immediately: immediately === true
    })

    return res.status(200).json({
      message: 'Subscription cancelled successfully',
      response: updated,
      statusCode: 200
    })
  }
}
