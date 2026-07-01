import * as utils from './utils'
import { _PrintConfig, ComponentLifecycleLabels, Printer } from './types'

const { getGroupLabel, getComponentName, print, getPrinter, getMessage } = utils

describe('utils', () => {
  jest.spyOn(utils, 'getCurrentTime').mockReturnValue('09:38 PM')
  describe('getGroupLabel', () => {
    it('renders', () => {
      expect(getGroupLabel(ComponentLifecycleLabels.Change)).toEqual(
        'Change @ 09:38 PM',
      )
    })

    it('renders with component name', () => {
      expect(
        getGroupLabel(ComponentLifecycleLabels.Mount, 'TestComponent'),
      ).toEqual('Mount in <TestComponent /> @ 09:38 PM')
    })
  })

  describe('getComponentName', () => {
    it('gets component name', () => {
      expect(getComponentName()).toEqual('_callCircusTest')
    })

    it('returns empty string if error.stack is not supported by the browser', () => {
      const customError = new Error('error without stack')
      delete customError.stack
      expect(getComponentName(customError)).toEqual('')
    })

    it('returns empty string if error.stack has different format', () => {
      const customError = new Error('error with unsupported stack')
      customError.stack =
        'This is custom implementation of stack: calledThis > calledThat'
      expect(getComponentName(customError)).toEqual('')
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
      componentName: 'SomeComponentName',
    }

    it('prints', () => {
      print(printProps)

      expect(consoleGroup).toHaveBeenCalledWith(
        'Change in <SomeComponentName /> @ 09:38 PM',
        undefined,
        undefined,
      )
      expect(consoleLog).toHaveBeenCalledWith('     On Change: Test Value')
      expect(consoleLog).toHaveBeenCalledTimes(1)
      expect(consoleGroupEnd).toHaveBeenCalled()
    })

    it('prints previous value', () => {
      print({ ...printProps, prevValue: 'Some Previous value' })

      expect(consoleGroup).toHaveBeenCalledWith(
        'Change in <SomeComponentName /> @ 09:38 PM',
        undefined,
        undefined,
      )
      expect(consoleLog).toHaveBeenCalledWith(
        'Previous Value: Some Previous value',
      )
      expect(consoleLog).toHaveBeenCalledWith(' Current Value: Test Value')
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
      expect(consoleLog).toHaveBeenCalledWith('     On Change: Test Value')
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
        'Change in <SomeComponentName /> @ 09:38 PM',
        undefined,
        undefined,
      )
      expect(consoleLog).toHaveBeenCalledWith('     On Change: Test Value')
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
      print(printProps)

      expect(consoleLog).toHaveBeenCalledWith('     On Change: Test Value')
    })

    it('prints with custom group label', () => {
      print({
        ...printProps,
        groupLabelRenderer: (type, name) => `${type} ${name}`,
      })

      expect(consoleGroup).toHaveBeenCalledWith(
        'Change SomeComponentName',
        undefined,
        undefined,
      )
    })
  })

  describe('getMessage', () => {
    it('returns message', () => {
      expect(getMessage('Test Value', 'Some Label')).toEqual(
        '    Some Label: Test Value',
      )
    })

    it('returns message without label', () => {
      expect(getMessage('Test Value')).toEqual('                Test Value')
    })

    it('returns message with css', () => {
      expect(getMessage('Test Value', 'Some Label', true)).toEqual(
        '    Some Label: %cTest Value',
      )
    })

    it('returns message with object', () => {
      expect(getMessage({ a: 'Test', b: 'Value' }, 'Some Label')).toEqual(
        '    Some Label: {"a":"Test","b":"Value"}',
      )
    })

    it('returns message with array', () => {
      expect(getMessage(['Test', 'Value'], 'Some Label')).toEqual(
        '    Some Label: ["Test","Value"]',
      )
    })

    it('returns message with array of objects', () => {
      expect(
        getMessage(
          [
            { a: 'Test', b: 'Value' },
            { c: 'Test', d: 'Value' },
          ],
          'Some Label',
        ),
      ).toEqual(
        '    Some Label: [{"a":"Test","b":"Value"},{"c":"Test","d":"Value"}]',
      )
    })
  })

  describe('getRenderFunctionProps', () => {
    const printProps: _PrintConfig<string> = {
      value: 'Test Value',
      componentName: 'SomeComponentName',
      printer: console,
      logLevel: 'warn',
    }

    it('returns print props', () => {
      expect(utils.getRenderFunctionProps(printProps, false)).toHaveProperty(
        'logLevel',
      )
    })

    it('returns print props', () => {
      expect(utils.getRenderFunctionProps(printProps, true)).not.toHaveProperty(
        'logLevel',
      )
    })
  })
})
