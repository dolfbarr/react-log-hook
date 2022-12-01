import { useLog } from './index'
import * as utils from './utils'
import { act, renderHook } from '@testing-library/react'
import { useEffect, useState } from 'react'

describe('useLog', () => {
  const OLD_ENV = process.env
  jest.spyOn(utils, 'getCurrentTime').mockReturnValue('09:38 PM')
  const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => null)
  const consoleGroup = jest
    .spyOn(console, 'group')
    .mockImplementation(() => null)

  const consoleGroupCollapsed = jest
    .spyOn(console, 'groupCollapsed')
    .mockImplementation(() => null)

  beforeEach(() => {
    jest.useFakeTimers()
    jest.resetModules()
    process.env = { ...OLD_ENV }
    process.env.NODE_ENV = 'dev'
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
    process.env = OLD_ENV
  })

  it('exists', () => {
    expect(useLog).toBeTruthy()
  })

  it('renders hook', () => {
    const { result } = renderHook(useLog)
    expect(result.current.log).toBeTruthy()

    renderHook(() => result.current.log('Test'))
    expect(consoleLog).toBeCalledWith('      On mount: Test')
    expect(consoleLog).toBeCalledWith(
      'Previous value: %cTest',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith(
      ' Current value: %cTest',
      'color: green; font-weight: bold;',
    )
    expect(consoleLog).toBeCalledTimes(3)
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

    /*
     * Set Initial Values
     */
    expect(consoleGroup).toBeCalledWith(
      'Mount in %c<TestComponent /> %c@ 09:38 PM',
      'color: DodgerBlue',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith('      On mount: null')

    expect(consoleGroup).toBeCalledWith(
      'Change in %c<TestComponent /> %c@ 09:38 PM',
      'color: DodgerBlue',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith(
      'Previous value: %cnull',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith(
      ' Current value: %cnull',
      'color: green; font-weight: bold;',
    )
    expect(consoleGroup).toBeCalledWith(
      'Change in %c<TestComponent /> %c@ 09:38 PM',
      'color: DodgerBlue',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith(
      'Previous value: %cnull',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith(
      ' Current value: %cnull',
      'color: green; font-weight: bold;',
    )
    expect(consoleLog).toBeCalledTimes(5)
    expect(consoleGroup).toBeCalledTimes(3)

    /*
     * Check first change
     */
    await act(() => {
      jest.advanceTimersByTime(1000)
      logRerender()
    })
    expect(consoleGroup).toBeCalledWith(
      'Change in %c<TestComponent /> %c@ 09:38 PM',
      'color: DodgerBlue',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith(
      'Previous value: %cnull',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith(
      ' Current value: %conChange 1s',
      'color: green; font-weight: bold;',
    )
    expect(consoleLog).toBeCalledTimes(7)
    expect(consoleGroup).toBeCalledTimes(4)

    /*
     * Check second change
     */
    await act(() => {
      jest.advanceTimersByTime(1000)
      logRerender()
    })
    expect(consoleGroup).toBeCalledWith(
      'Change in %c<TestComponent /> %c@ 09:38 PM',
      'color: DodgerBlue',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith(
      'Previous value: %conChange 1s',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith(
      ' Current value: %conChange 2s',
      'color: green; font-weight: bold;',
    )
    expect(consoleLog).toBeCalledTimes(9)
    expect(consoleGroup).toBeCalledTimes(5)

    /*
     * Check unmount change
     */
    await act(() => {
      logUnmount()
    })
    expect(consoleGroup).toBeCalledWith(
      'Unmount in %c<TestComponent /> %c@ 09:38 PM',
      'color: DodgerBlue',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith(
      'Previous value: %conChange 2s',
      'color: SlateGray; font-weight: thin;',
    )
    expect(consoleLog).toBeCalledWith(
      ' Current value: %cnull',
      'color: green; font-weight: bold;',
    )
    expect(consoleLog).toBeCalledTimes(11)
    expect(consoleGroup).toBeCalledTimes(6)
  })
  it('renders hook with custom styles', () => {
    renderHook(() => {
      const { log } = useLog({ styles: { componentCSS: 'color: darkBlue;' } })
      log('Test')
    })

    // first call, second parameter (css for component name) should be modified
    expect(consoleGroup.mock.calls[0][1]).toBe('color: darkBlue;')
  })

  it('renders log with custom styles', () => {
    renderHook(() => {
      const { log } = useLog({ styles: { componentCSS: 'color: darkBlue;' } })
      log('Test', { styles: { componentCSS: 'color: darkRed;' } })
    })

    // first call, second parameter (css for component name) should be modified
    expect(consoleGroup.mock.calls[0][1]).toBe('color: darkRed;')
  })

  it('renders log with custom styles for subValueCSS', () => {
    renderHook(() => {
      const { log } = useLog({ styles: { subValueCSS: 'color: darkBlue;' } })
      log('Test', { styles: { subValueCSS: 'color: darkRed;' } })
    })

    // first call, third parameter (css for call time) should be modified
    expect(consoleGroup.mock.calls[0][2]).toBe('color: darkRed;')
  })

  it('renders log with custom styles for changeCSS', () => {
    renderHook(() => {
      const { log } = useLog({ styles: { changeCSS: 'color: darkBlue;' } })
      log('Test', { styles: { changeCSS: 'color: darkRed;' } })
    })

    // third call, third parameter (css for new value) should be modified
    expect(consoleLog.mock.calls[2][1]).toBe('color: darkRed;')
  })

  it('does not render anything in production', () => {
    process.env.NODE_ENV = 'production'

    const { result } = renderHook(useLog)
    renderHook(() => result.current.log('Test'))

    expect(consoleLog).not.toBeCalled()
  })

  it('renders anything in custom allowed environments', () => {
    process.env.NODE_ENV = 'test_env'

    renderHook(() => {
      const { log } = useLog({ environments: ['test_env'] })
      log('Test')
    })

    expect(consoleLog).toBeCalled()
  })

  it('falls back to production for empty node_env', () => {
    process.env.NODE_ENV = undefined

    const { result } = renderHook(useLog)
    renderHook(() => result.current.log('Test'))

    expect(consoleLog).not.toBeCalled()
  })

  it('renders log with disabled groups', () => {
    renderHook(() => {
      const { log } = useLog({ isGroupingEnabled: true })
      log('Test', { isGroupingEnabled: false })
    })

    expect(consoleGroup).not.toHaveBeenCalled()
  })

  it('renders log with disabled groups', () => {
    renderHook(() => {
      const { log } = useLog({ isGroupingEnabled: false })
      log('Test', { isGroupingEnabled: true, isGroupCollapsed: true })
    })

    expect(consoleGroup).not.toHaveBeenCalled()
    expect(consoleGroupCollapsed).toHaveBeenCalled()
    // first call, first parameter for group name should exist
    expect(consoleGroupCollapsed.mock.calls[0][0]).toBe(
      'Mount in %c<TestComponent /> %c@ 09:38 PM',
    )
  })

  it('renders hook with custom printer', () => {
    const printer = { log: jest.fn() }

    const printerLog = jest.spyOn(printer, 'log').mockImplementation(() => null)

    renderHook(() => {
      const { log } = useLog({ printer })
      log('Test')
    })

    expect(consoleLog).not.toHaveBeenCalled()

    expect(printerLog).toHaveBeenCalled()
  })

  it('renders log with custom printer', () => {
    const printer = { log: jest.fn() }
    const anotherPrinter = { log: jest.fn() }

    const printerLog = jest.spyOn(printer, 'log').mockImplementation(() => null)
    const anotherPrinterLog = jest
      .spyOn(anotherPrinter, 'log')
      .mockImplementation(() => null)

    renderHook(() => {
      const { log } = useLog({ printer })
      log('Test', { printer: anotherPrinter })
    })

    expect(consoleLog).not.toHaveBeenCalled()
    expect(printerLog).not.toHaveBeenCalled()

    expect(anotherPrinterLog).toHaveBeenCalled()
  })

  it('renders hook with custom log level', () => {
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => null)

    renderHook(() => {
      const { log } = useLog({ logLevel: 'warn' })
      log('Test')
    })

    expect(consoleLog).not.toHaveBeenCalled()
    expect(consoleWarn).toHaveBeenCalled()
  })

  it('renders hook with custom log level', () => {
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => null)
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => null)

    renderHook(() => {
      const { log } = useLog({ logLevel: 'error' })
      log('Test', { logLevel: 'warn' })
    })

    expect(consoleLog).not.toHaveBeenCalled()
    expect(consoleError).not.toHaveBeenCalled()
    expect(consoleWarn).toHaveBeenCalled()
  })
})
