import ICriticalSection from "./i-critical-section"

export default class CriticalSection implements ICriticalSection {
  private executing = false
  private queued: null | {
    callback(): Promise<void>
    resolve(): void
    reject(reason?: any): void
  } = null

  async execute(
    callback: () => Promise<void>,
  ): Promise<void> {
    if (this.executing) {
      if (this.queued) {
        this.queued.resolve()
      }

      await new Promise<void>((resolve, reject) => {
        this.queued = {
          callback,
          resolve,
          reject,
        }
      })
    } else {
      this.executing = true
      try {
        await callback()
      } finally {
        this.checkForQueued()
      }
    }
  }

  checkForQueued() {
    if (this.queued) {
      const queued = this.queued
      this.queued = null
      queued
        .callback()
        .then(
          () => {
            queued.resolve()
            this.checkForQueued()
          },
          reason => {
            queued.reject(reason)
            this.checkForQueued()
          }
        )
    } else {
      this.executing = false
    }
  }
}
