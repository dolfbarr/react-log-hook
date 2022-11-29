import { _PrintConfig, _PrintTypes } from './types'

export function getGroupLabel(
  type: _PrintTypes,
  componentName?: string,
): string {
  return `${String(type)} ${
    componentName ? 'in %c<' + String(componentName) + ' /> ' : '%c'
  }%c@ ${new Date().toLocaleTimeString()}`
}

export function getComponentName(): string {
  // Tested in the scope of useLog testing
  try {
    throw new Error('Getting the stack of error to parse it for component name')
  } catch (error) {
    /* istanbul ignore next */
    if (error instanceof Error && error?.stack) {
      const re = /(\w+)@|at (\w+) \(/g

      re.exec(error.stack ?? '')
      re.exec(error.stack ?? '')
      const m = re.exec(error.stack ?? '') ?? []

      return String(m[1] || m[2])
    }

    /* istanbul ignore next */
    return '' // will be never reached since getComponentName always throws an instance of Error to parse the stack
  }
}

export function print<T>({
  value,
  label,
  prevValue,
  componentName,
  flags = {
    isCollapsed: false,
    isGrouped: true,
  },
  type = _PrintTypes.Change,
  group = getGroupLabel(type, componentName),
  styles: { componentCSS, subValueCSS, changeCSS } = {},
}: _PrintConfig<T>): void {
  flags.isGrouped &&
    console[flags.isCollapsed ? 'groupCollapsed' : 'group'](
      group,
      componentCSS,
      subValueCSS,
    )

  if (!('prevValue' in arguments[0])) {
    console.log(`${label.padStart(14, ' ')}: ${String(value)}`)
  } else {
    console.log(
      `Previous value: %c${String(arguments[0].prevValue)}`,
      subValueCSS,
    )
    console.log(` Current value: %c${String(value)}`, changeCSS)
  }

  flags.isGrouped && console.groupEnd()
}
