import cron, {
  type ScheduleOptions as CronScheduleOptions,
  type ScheduledTask
} from 'node-cron'
import express, { type Router as ExpressRouter } from 'express'
import { Logger } from 'api/logger'
import type { HttpConsumer } from '@types'
import { Middleware } from 'middlewares'
import { ConfigService } from 'api/config/config.service'
import { lockAndRun } from 'common/cronLock'

type Constructor<T = object> = new (...args: any[]) => T

type MethodDecoratorTarget = object

type CronTrigger = {
  schedule(
    expression: string,
    callback: () => void | Promise<void>,
    options?: CronScheduleOptions
  ): ScheduledTask
}

function Readonly(
  _target: MethodDecoratorTarget,
  _property: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  descriptor.writable = false
  return descriptor
}

function CronSchedule<TBase extends Constructor>(Tasks: TBase) {
  const lockTtlMs = parseInt(process.env.REDIS_LOCK_TTL_MS || '30000', 10)

  return class Schedule extends Tasks {
    trigger: CronTrigger = {
      schedule(
        expression: string,
        callback: () => void | Promise<void>,
        options?: CronScheduleOptions
      ): ScheduledTask {
        const key = `${Tasks.name}:${expression}`
        return cron.schedule(
          expression,
          async () => {
            await lockAndRun(key, lockTtlMs, callback)
          },
          options
        )
      }
    }
  }
}

function Router({
  alias,
  route
}: {
  alias: string
  route: string
}) {
  return function <TBase extends Constructor>(Controller: TBase) {
    return class Handler extends Controller {
      [key: string]: unknown
      [alias] = express.Router()
      handler = route

      get consumer(): HttpConsumer {
        return {
          route: this.handler,
          handlers: this[alias] as ExpressRouter
        }
      }
    }
  }
}

function Bind(
  _target: MethodDecoratorTarget,
  property: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const func = descriptor.value as (...args: unknown[]) => unknown

  return {
    configurable: true,

    get(this: object) {
      const boundFunc = func.bind(this)

      Reflect.defineProperty(this, property, {
        value: boundFunc,
        configurable: true,
        writable: true
      })

      return function (this: unknown, ...args: unknown[]): unknown {
        return boundFunc.apply(this, args)
      }
    }
  }
}

function Controller(target: Constructor): void {
  function getMethodDescriptor(propertyName: string): PropertyDescriptor {
    const ownDescriptor = Object.getOwnPropertyDescriptor(
      target.prototype,
      propertyName
    )

    if (ownDescriptor) {
      return ownDescriptor
    }

    return {
      configurable: true,
      enumerable: true,
      writable: true,
      value: Middleware.secure(target.prototype[propertyName] as never)
    }
  }

  for (const propertyName in target.prototype) {
    const currentProperty = target.prototype[propertyName]
    const isMethod = currentProperty instanceof Function

    if (isMethod) {
      const descriptor = getMethodDescriptor(propertyName)
      const originalMethod = descriptor.value as {
        appy: (context: unknown, args: unknown[]) => unknown
      }

      descriptor.value = function (...args: unknown[]): unknown {
        const context = originalMethod.appy(this, args)

        return Middleware.secure(context as never)
      }

      Object.defineProperty(
        Middleware.secure(target.prototype as never),
        propertyName,
        descriptor
      )
    }

    continue
  }
}

function Injectable<TBase extends Constructor>(ClassRef: TBase) {
  return class InjectableRef extends ClassRef {
    logger = Logger.Service
    config = new ConfigService()

    get provider(): unknown {
      return this.config.provider
    }
  }
}

export { Controller, Injectable, Bind, Router, CronSchedule, Readonly }
