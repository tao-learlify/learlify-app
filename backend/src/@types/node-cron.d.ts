declare module 'node-cron' {
  export interface ScheduleOptions {
    scheduled?: boolean
    timezone?: string
    recoverMissedExecutions?: boolean
    name?: string
  }

  export interface ScheduledTask {
    start(): void
    stop(): void
    destroy(): void
  }

  export function schedule(
    expression: string,
    callback: () => void | Promise<void>,
    options?: ScheduleOptions
  ): ScheduledTask

  const cron: {
    schedule: typeof schedule
  }

  export default cron
}
