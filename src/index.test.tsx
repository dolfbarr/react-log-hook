import { useLog } from './index'
import { act, renderHook } from '@testing-library/react'
import { useEffect, useState } from 'react'

describe('useLog', () => {
  const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('exists', () => {
    expect(useLog).toBeTruthy()
  })

  it('renders hook', () => {
    const { result } = renderHook(useLog)
    expect(result.current.log).toBeTruthy()

    renderHook(() => result.current.log('Test'))
    expect(consoleLog).toBeCalledWith('On mount: Test')
    expect(consoleLog).toBeCalledWith('On change: Test')
    expect(consoleLog).toBeCalledTimes(2)
  })

  it('renders hook with changes', async () => {
    const { result } = renderHook(useLog)
    const { unmount: logUnmount, rerender: logRerender } = renderHook(() => {
      const [state, setState] = useState<string | null>(null)

      result.current.log(state)

      useEffect(() => {
        setState('onMount')

        setTimeout(() => {
          setState('onChange 1s')
        }, 1000)

        setTimeout(() => {
          setState('onChange 2s')
        }, 2000)
      }, [])
    })

    // set initial values
    expect(consoleLog).toBeCalledWith('On mount: null')
    expect(consoleLog).toBeCalledWith('On change: null')

    // since react renderHook has an additional on mount event
    expect(consoleLog).toBeCalledWith('On change: onMount')

    expect(consoleLog).toBeCalledTimes(3)

    await act(() => {
      jest.advanceTimersByTime(1000)
      logRerender()
    })
    expect(consoleLog).toBeCalledWith('On change: onChange 1s')
    expect(consoleLog).toBeCalledTimes(4)

    await act(() => {
      jest.advanceTimersByTime(1000)
      logRerender()
    })
    expect(consoleLog).toBeCalledWith('On change: onChange 2s')
    expect(consoleLog).toBeCalledTimes(5)

    await act(() => {
      logUnmount()
    })
    expect(consoleLog).toBeCalledWith('On unmount: null')
    expect(consoleLog).toBeCalledTimes(6)
  })
})
