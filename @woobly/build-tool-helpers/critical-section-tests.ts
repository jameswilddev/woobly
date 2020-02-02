import CriticalSection from "./critical-section"

describe(`@woobly/build-tool-helpers`, () => {
  describe(`criticalSection`, () => {
    let criticalSection: CriticalSection
    let callbackPromiseResolveA: () => void
    let callbackPromiseRejectA: (reason: any) => void
    let callbackA: jasmine.Spy
    let resultA: Promise<void>
    let resultAResolved: boolean
    let callbackPromiseResolveB: () => void
    let callbackPromiseRejectB: (reason: any) => void
    let callbackB: jasmine.Spy
    let resultB: Promise<void>
    let resultBResolved: boolean
    let callbackPromiseResolveC: () => void
    let callbackPromiseRejectC: (reason: any) => void
    let callbackC: jasmine.Spy
    let resultC: Promise<void>
    let resultCResolved: boolean
    beforeEach(() => {
      criticalSection = new CriticalSection()
      callbackA = jasmine
        .createSpy(`callbackA`)
        .and
        .returnValue(new Promise<void>((resolve, reject) => {
          callbackPromiseResolveA = resolve
          callbackPromiseRejectA = reject
        }))
      resultAResolved = false
      callbackB = jasmine
        .createSpy(`callbackB`)
        .and
        .returnValue(new Promise<void>((resolve, reject) => {
          callbackPromiseResolveB = resolve
          callbackPromiseRejectB = reject
        }))
      resultBResolved = false
      callbackC = jasmine
        .createSpy(`callbackC`)
        .and
        .returnValue(new Promise<void>((resolve, reject) => {
          callbackPromiseResolveC = resolve
          callbackPromiseRejectC = reject
        }))
      resultCResolved = false
    })

    const delay = 50

    describe(`execute`, () => {
      beforeEach(done => {
        resultA = criticalSection.execute(callbackA)
        resultA.then(() => { resultAResolved = true }, () => { resultAResolved = true })
        setTimeout(done, delay)
      })
      it(`executes the first callback once`, () => expect(callbackA).toHaveBeenCalledTimes(1))
      it(`does not resolve the first returned promise`, () => expect(resultAResolved).toBeFalse())
      describe(`resolve`, () => {
        beforeEach(done => {
          callbackPromiseResolveA()
          setTimeout(done, delay)
        })
        it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
        it(`resolves the first returned promise`, () => expectAsync(resultA).toBeResolved())
        describe(`execute`, () => {
          beforeEach(done => {
            resultB = criticalSection.execute(callbackB)
            resultB.then(() => { resultBResolved = true }, () => { resultBResolved = true })
            setTimeout(done, delay)
          })
          it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
          it(`executes the second callback once`, () => expect(callbackB).toHaveBeenCalledTimes(1))
          it(`does not resolve the second returned promise`, () => expect(resultBResolved).toBeFalse())
          describe(`resolve`, () => {
            beforeEach(done => {
              callbackPromiseResolveB()
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
            it(`resolves the second returned promise`, () => expectAsync(resultB).toBeResolved())
            describe(`execute`, () => {
              beforeEach(done => {
                resultC = criticalSection.execute(callbackC)
                resultC.then(() => { resultCResolved = true }, () => { resultCResolved = true })
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
          })
          describe(`reject`, () => {
            beforeEach(done => {
              callbackPromiseRejectB(`Test Reason B`)
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
            it(`rejects the second returned promise`, () => expectAsync(resultB).toBeRejected(`Test Reason B`))
            describe(`execute`, () => {
              beforeEach(done => {
                resultC = criticalSection.execute(callbackC)
                resultC.then(() => { resultCResolved = true }, () => { resultCResolved = true })
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
          })
          describe(`execute`, () => {
            beforeEach(done => {
              resultC = criticalSection.execute(callbackC)
              resultC.then(() => { resultCResolved = true }, () => { resultCResolved = true })
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
            it(`does not resolve the second returned promise`, () => expect(resultBResolved).toBeFalse())
            it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
            describe(`resolve`, () => {
              beforeEach(done => {
                callbackPromiseResolveB()
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`resolves the second returned promise`, () => expectAsync(resultB).toBeResolved())
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
            describe(`reject`, () => {
              beforeEach(done => {
                callbackPromiseRejectB(`Test Reason B`)
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`rejects the second returned promise`, () => expectAsync(resultB).toBeRejected(`Test Reason B`))
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
          })
        })
      })
      describe(`reject`, () => {
        beforeEach(done => {
          callbackPromiseRejectA(`Test Reason A`)
          setTimeout(done, delay)
        })
        it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
        it(`rejects the first returned promise`, () => expectAsync(resultA).toBeRejected(`Test Reason A`))
        describe(`execute`, () => {
          beforeEach(done => {
            resultB = criticalSection.execute(callbackB)
            resultB.then(() => { resultBResolved = true }, () => { resultBResolved = true })
            setTimeout(done, delay)
          })
          it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
          it(`executes the second callback once`, () => expect(callbackB).toHaveBeenCalledTimes(1))
          describe(`resolve`, () => {
            beforeEach(done => {
              callbackPromiseResolveB()
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
            it(`resolves the second returned promise`, () => expectAsync(resultB).toBeResolved())
            describe(`execute`, () => {
              beforeEach(done => {
                resultC = criticalSection.execute(callbackC)
                resultC.then(() => { resultCResolved = true }, () => { resultCResolved = true })
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
          })
          describe(`reject`, () => {
            beforeEach(done => {
              callbackPromiseRejectB(`Test Reason B`)
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
            it(`rejects the second returned promise`, () => expectAsync(resultB).toBeRejected(`Test Reason B`))
            describe(`execute`, () => {
              beforeEach(done => {
                resultC = criticalSection.execute(callbackC)
                resultC.then(() => { resultCResolved = true }, () => { resultCResolved = true })
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
          })
          describe(`execute`, () => {
            beforeEach(done => {
              resultC = criticalSection.execute(callbackC)
              resultC.then(() => { resultCResolved = true }, () => { resultCResolved = true })
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
            it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
            describe(`resolve`, () => {
              beforeEach(done => {
                callbackPromiseResolveB()
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`resolves the second returned promise`, () => expectAsync(resultB).toBeResolved())
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
            describe(`reject`, () => {
              beforeEach(done => {
                callbackPromiseRejectB(`Test Reason B`)
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`rejects the second returned promise`, () => expectAsync(resultB).toBeRejected(`Test Reason B`))
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
          })
        })
      })
      describe(`execute`, () => {
        beforeEach(done => {
          resultB = criticalSection.execute(callbackB)
          resultB.then(() => { resultBResolved = true }, () => { resultBResolved = true })
          setTimeout(done, delay)
        })
        it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
        it(`does not execute the second callback`, () => expect(callbackB).not.toHaveBeenCalled())
        it(`does not resolve the first returned promise`, () => expect(resultAResolved).toBeFalse())
        it(`does not resolve the second returned promise`, () => expect(resultBResolved).toBeFalse())
        describe(`resolve`, () => {
          beforeEach(done => {
            callbackPromiseResolveA()
            setTimeout(done, delay)
          })
          it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
          it(`executes the second callback once`, () => expect(callbackB).toHaveBeenCalledTimes(1))
          it(`does not resolve the second returned promise`, () => expect(resultBResolved).toBeFalse())
          it(`resolves the first returned promise`, () => expectAsync(resultA).toBeResolved())
          describe(`resolve`, () => {
            beforeEach(done => {
              callbackPromiseResolveB()
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
            it(`resolves the second returned promise`, () => expectAsync(resultB).toBeResolved())
            describe(`execute`, () => {
              beforeEach(done => {
                resultC = criticalSection.execute(callbackC)
                resultC.then(() => { resultCResolved = true }, () => { resultCResolved = true })
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
          })
          describe(`reject`, () => {
            beforeEach(done => {
              callbackPromiseRejectB(`Test Reason B`)
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
            it(`rejects the second returned promise`, () => expectAsync(resultB).toBeRejected(`Test Reason B`))
            describe(`execute`, () => {
              beforeEach(done => {
                resultC = criticalSection.execute(callbackC)
                resultC.then(() => { resultCResolved = true }, () => { resultCResolved = true })
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
          })
        })
        describe(`reject`, () => {
          beforeEach(done => {
            callbackPromiseRejectA(`Test Reason A`)
            setTimeout(done, delay)
          })
          it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
          it(`executes the second callback once`, () => expect(callbackB).toHaveBeenCalledTimes(1))
          it(`rejects the first returned promise`, () => expectAsync(resultA).toBeRejected(`Test Reason A`))
          it(`does not resolve the second returned promise`, () => expect(resultBResolved).toBeFalse())
          describe(`resolve`, () => {
            beforeEach(done => {
              callbackPromiseResolveB()
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
            it(`resolves the second returned promise`, () => expectAsync(resultB).toBeResolved())
            describe(`execute`, () => {
              beforeEach(done => {
                resultC = criticalSection.execute(callbackC)
                resultC.then(() => { resultCResolved = true }, () => { resultCResolved = true })
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
          })
          describe(`reject`, () => {
            beforeEach(done => {
              callbackPromiseRejectB(`Test Reason B`)
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
            it(`rejects the second returned promise`, () => expectAsync(resultB).toBeRejected(`Test Reason B`))
            describe(`execute`, () => {
              beforeEach(done => {
                resultC = criticalSection.execute(callbackC)
                resultC.then(() => { resultCResolved = true }, () => { resultCResolved = true })
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
              it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
              describe(`resolve`, () => {
                beforeEach(done => {
                  callbackPromiseResolveC()
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
              })
              describe(`reject`, () => {
                beforeEach(done => {
                  callbackPromiseRejectC(`Test Reason C`)
                  setTimeout(done, delay)
                })
                it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
                it(`does not execute the second callback again`, () => expect(callbackB).toHaveBeenCalledTimes(1))
                it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
                it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
              })
            })
          })
        })
        describe(`execute`, () => {
          beforeEach(done => {
            resultC = criticalSection.execute(callbackC)
            resultC.then(() => { resultCResolved = true }, () => { resultCResolved = true })
            setTimeout(done, delay)
          })
          it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
          it(`does not execute the second callback`, () => expect(callbackB).not.toHaveBeenCalled())
          it(`does not resolve the first returned promise`, () => expect(resultAResolved).toBeFalse())
          it(`resolves the second returned promise`, () => expectAsync(resultB).toBeResolved())
          it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
          describe(`resolve`, () => {
            beforeEach(done => {
              callbackPromiseResolveA()
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback`, () => expect(callbackB).not.toHaveBeenCalled())
            it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
            it(`resolves the first returned promise`, () => expectAsync(resultA).toBeResolved())
            it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
            describe(`resolve`, () => {
              beforeEach(done => {
                callbackPromiseResolveC()
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback`, () => expect(callbackB).not.toHaveBeenCalled())
              it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
            })
            describe(`reject`, () => {
              beforeEach(done => {
                callbackPromiseRejectC(`Test Reason C`)
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback`, () => expect(callbackB).not.toHaveBeenCalled())
              it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
            })
          })
          describe(`reject`, () => {
            beforeEach(done => {
              callbackPromiseRejectA(`Test Reason A`)
              setTimeout(done, delay)
            })
            it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
            it(`does not execute the second callback`, () => expect(callbackB).not.toHaveBeenCalled())
            it(`executes the third callback once`, () => expect(callbackC).toHaveBeenCalledTimes(1))
            it(`rejects the first returned promise`, () => expectAsync(resultA).toBeRejected(`Test Reason A`))
            it(`does not resolve the third returned promise`, () => expect(resultCResolved).toBeFalse())
            describe(`resolve`, () => {
              beforeEach(done => {
                callbackPromiseResolveC()
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback`, () => expect(callbackB).not.toHaveBeenCalled())
              it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`resolves the third returned promise`, () => expectAsync(resultC).toBeResolved())
            })
            describe(`reject`, () => {
              beforeEach(done => {
                callbackPromiseRejectC(`Test Reason C`)
                setTimeout(done, delay)
              })
              it(`does not execute the first callback again`, () => expect(callbackA).toHaveBeenCalledTimes(1))
              it(`does not execute the second callback`, () => expect(callbackB).not.toHaveBeenCalled())
              it(`does not execute the third callback again`, () => expect(callbackC).toHaveBeenCalledTimes(1))
              it(`rejects the third returned promise`, () => expectAsync(resultC).toBeRejected(`Test Reason C`))
            })
          })
        })
      })
    })
  })
})
