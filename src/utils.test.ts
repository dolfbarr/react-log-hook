import { getGroupLabel, getComponentName, print } from './utils'
import { _PrintConfig, _PrintTypes } from './types'

describe('utils', () => {
  describe('getGroupLabel', () => {
    it('renders', () => {
      expect(getGroupLabel(_PrintTypes.Change)).toEqual(
        `Change %c%c@ ${new Date().toLocaleTimeString()}`,
      )
    })

    it('renders with component name', () => {
      expect(getGroupLabel(_PrintTypes.Mount, 'TestComponent')).toEqual(
        `Mount in %c<TestComponent /> %c@ ${new Date().toLocaleTimeString()}`,
      )
    })
  })

  describe('getComponentName', () => {
    it('gets component name', () => {
      expect(getComponentName()).toEqual('_callCircusTest')
    })
  })

  describe('print', () => {
    const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => null)
    const consoleGroup = jest
      .spyOn(console, 'group')
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
        `Change in %c<SomeComponentName /> %c@ ${new Date().toLocaleTimeString()}`,
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
        `Change in %c<SomeComponentName /> %c@ ${new Date().toLocaleTimeString()}`,
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
  })
})
