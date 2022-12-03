import * as utils from './utils'
import { _PrintConfig, _PrintTypes, Printer } from './types'

const { getGroupLabel, getComponentName, print, getPrinter } = utils

describe('utils', () => {
  jest.spyOn(utils, 'getCurrentTime').mockReturnValue('09:38 PM')
  describe('getGroupLabel', () => {
    it('renders', () => {
      expect(getGroupLabel(_PrintTypes.Change)).toEqual('Change %c%c@ 09:38 PM')
    })

    it('renders with component name', () => {
      expect(getGroupLabel(_PrintTypes.Mount, 'TestComponent')).toEqual(
        'Mount in %c<TestComponent /> %c@ 09:38 PM',
      )
    })
  })

  describe('getComponentName', () => {
    it('gets component name', () => {
      expect(getComponentName()).toEqual('_callCircusTest')
    })
  })

  describe('getPrinter', () => {
    it('returns printer for existing printer method', () => {
      const printer: Printer = { log: jest.fn() }
      expect(getPrinter(printer, 'log')).toBe(printer.log)
    })

    it('returns console for non-existing printer method', () => {
      const printer: Printer = { log: jest.fn() }
      expect(getPrinter(printer, 'warn')).toBe(console.warn)
    })

    it('returns console for empty printer', () => {
      const printer: Printer = {}
      expect(getPrinter(printer, 'log')).toBe(console.log)
    })

    it('returns console for empty printer method', () => {
      const printer: Printer = { log: undefined }
      expect(getPrinter(printer, 'log')).toBe(console.log)
    })
  })

  describe('print', () => {
    const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => null)
    const consoleGroup = jest
      .spyOn(console, 'group')
      .mockImplementation(() => null)
    const consoleGroupCollapsed = jest
      .spyOn(console, 'groupCollapsed')
      .mockImplementation(() => null)
    const consoleGroupEnd = jest
      .spyOn(console, 'groupEnd')
      .mockImplementation(() => null)

    const printProps: _PrintConfig<string> = {
      value: 'Test Value',
      label: 'A Label',
      componentName: 'SomeComponentName',
    }

    it('prints', () => {
      print(printProps)

      expect(consoleGroup).toHaveBeenCalledWith(
        'Change in %c<SomeComponentName /> %c@ 09:38 PM',
        undefined,
        undefined,
      )
      expect(consoleLog).toHaveBeenCalledWith('       A Label: Test Value')
      expect(consoleLog).toHaveBeenCalledTimes(1)
      expect(consoleGroupEnd).toHaveBeenCalled()
    })

    it('prints previous value', () => {
      print({ ...printProps, prevValue: 'Some Previous value' })

      expect(consoleGroup).toHaveBeenCalledWith(
        'Change in %c<SomeComponentName /> %c@ 09:38 PM',
        undefined,
        undefined,
      )
      expect(consoleLog).toHaveBeenCalledWith(
        'Previous value: %cSome Previous value',
        undefined,
      )
      expect(consoleLog).toHaveBeenCalledWith(
        ' Current value: %cTest Value',
        undefined,
      )
      expect(consoleLog).toHaveBeenCalledTimes(2)
      expect(consoleGroupEnd).toHaveBeenCalled()
    })

    it('does not print group per config', () => {
      print({
        ...printProps,
        flags: {
          isGrouped: false,
        },
      })

      expect(consoleGroup).not.toHaveBeenCalled()
      expect(consoleLog).toHaveBeenCalledWith('       A Label: Test Value')
      expect(consoleGroupEnd).not.toHaveBeenCalled()
    })

    it('prints collapsed group per config', () => {
      print({
        ...printProps,
        flags: {
          isGrouped: true,
          isCollapsed: true,
        },
      })

      expect(consoleGroup).not.toHaveBeenCalled()
      expect(consoleGroupCollapsed).toHaveBeenCalledWith(
        'Change in %c<SomeComponentName /> %c@ 09:38 PM',
        undefined,
        undefined,
      )
      expect(consoleLog).toHaveBeenCalledWith('       A Label: Test Value')
      expect(consoleGroupEnd).toHaveBeenCalled()
    })

    it('prints with custom printer', () => {
      const printer: Printer = { log: jest.fn() }
      const printPropsWithPrinter: _PrintConfig<string> = {
        ...printProps,
        printer,
      }
      const printerLog = jest
        .spyOn(printer, 'log')
        .mockImplementation(() => 'Some logs')

      print(printPropsWithPrinter)

      expect(consoleLog).not.toHaveBeenCalled()

      expect(consoleGroup).toHaveBeenCalled()
      expect(printerLog).toHaveBeenCalled()
      expect(consoleGroupEnd).toHaveBeenCalled()
    })

    it('prints with custom empty printer', () => {
      const printer: Printer = {}
      const printPropsWithPrinter: _PrintConfig<string> = {
        ...printProps,
        printer,
      }

      print(printPropsWithPrinter)

      expect(consoleGroup).toHaveBeenCalled()
      expect(consoleLog).toHaveBeenCalled()
      expect(consoleGroupEnd).toHaveBeenCalled()
    })

    it('prints with custom log level', () => {
      const consoleWarn = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => null)
      print({
        ...printProps,
        logLevel: 'warn',
      })

      expect(consoleGroup).toHaveBeenCalled()
      expect(consoleLog).not.toHaveBeenCalled()
      expect(consoleWarn).toHaveBeenCalled()
      expect(consoleGroupEnd).toHaveBeenCalled()
    })

    it('prints without label', () => {
      print({
        ...printProps,
        label: undefined,
      })

      expect(consoleLog).toHaveBeenCalledWith('                Test Value')
    })
  })
})
