import * as utils from './utils'
import { Printer, _PrintConfig, _PrintTypes, _SupportedConsole } from './types'
import {
  CURRENT_VALUE_LABEL,
  DEFAULT_LABEL_SIZE,
  PREVIOUS_VALUE_LABEL,
} from './constants'

/* istanbul ignore next */
export function getCurrentTime(): string {
  // No need in testing Date module
  return new Date().toLocaleTimeString()
}

export function stylePlaceholder(withCss?: boolean): string {
  return withCss ? '%c' : ''
}

export function getLabel(type: _PrintTypes): string {
  return `On ${type}`
}

export function getMessage<T>(
  value: T,
  label?: string,
  withCss?: boolean,
): string {
  const printLabel = label
    ? `${label.padStart(DEFAULT_LABEL_SIZE, ' ')}: `
    : ''.padStart(DEFAULT_LABEL_SIZE + 2, ' ')

  return `${printLabel}${stylePlaceholder(withCss)}${String(value)}`
}

export function getGroupLabel(
  type: _PrintTypes,
  componentName?: string,
  withComponentCSS?: boolean,
  withSubValueCSS?: boolean,
): string {
  const componentCssPlaceholder = stylePlaceholder(withComponentCSS)
  const subValueCssPlaceholder = stylePlaceholder(withComponentCSS)

  const componentNameWrapper = componentName
    ? `in ${componentCssPlaceholder}<${String(componentName)} /> `
    : `${componentCssPlaceholder}`
  const typeWrapper = `${String(type)} `
  const timeWrapper = `${subValueCssPlaceholder}@ ${utils.getCurrentTime()}`

  return `${typeWrapper}${componentNameWrapper}${timeWrapper}`
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

export function getPrinter(
  printer: Printer | Console,
  method: keyof _SupportedConsole,
): _SupportedConsole[keyof _SupportedConsole] {
  return (
    (printer && method in printer ? printer[method] : console[method]) ??
    console[method]
  )
}

export function print<T>({
  value,
  prevValue,
  componentName,
  flags = {
    isCollapsed: false,
    isGrouped: true,
  },
  type = _PrintTypes.Change,
  styles: { componentCSS, subValueCSS, changeCSS } = {},
  printer = {},
  logLevel = 'log',
}: _PrintConfig<T>): void {
  const getCurrentPrinter = (
    method: keyof _SupportedConsole,
  ): _SupportedConsole[keyof _SupportedConsole] => getPrinter(printer, method)

  if (flags.isGrouped) {
    getCurrentPrinter(flags.isCollapsed ? 'groupCollapsed' : 'group')(
      getGroupLabel(
        type,
        componentName,
        Boolean(componentCSS),
        Boolean(subValueCSS),
      ),
      componentCSS,
      subValueCSS,
    )
  }

  const printAtLevel = (
    label?: string,
    printValue: T = value,
    css?: string,
  ): void => {
    const printer = getCurrentPrinter(logLevel)
    const message = getMessage(printValue, label, Boolean(css))

    if (!css) printer(message)
    if (css) printer(message, css)
  }

  if ('prevValue' in arguments[0]) {
    printAtLevel(PREVIOUS_VALUE_LABEL, arguments[0].prevValue, subValueCSS)
    printAtLevel(CURRENT_VALUE_LABEL, value, changeCSS)
  } else {
    printAtLevel(getLabel(type))
  }

  if (flags.isGrouped) getCurrentPrinter('groupEnd')()
}
