import * as utils from './utils'
import {
  Printer,
  _PrintConfig,
  ComponentLifecycleLabels,
  _SupportedConsole,
  RenderProps,
} from './types'
import {
  CURRENT_VALUE_LABEL,
  DEFAULT_LABEL_SIZE,
  PREVIOUS_VALUE_LABEL,
} from './constants'

export function isObjectOrArray<T>(value: T): boolean {
  return Array.isArray(value) || (typeof value === 'object' && value !== null)
}

/* istanbul ignore next */
export function getCurrentTime(): string {
  // No need in testing Date module
  return new Date().toLocaleTimeString()
}

export function stylePlaceholder(withCss?: boolean): string {
  return withCss ? '%c' : ''
}

export function getLabel(type: ComponentLifecycleLabels): string {
  return `On ${type}`
}

export function getMessage<T>(
  value: T,
  label?: string,
  withCss?: boolean,
  inline = true,
): string {
  const printLabel = label
    ? `${label.padStart(DEFAULT_LABEL_SIZE, ' ')}: `
    : ''.padStart(DEFAULT_LABEL_SIZE + 2, ' ')

  const printValue = isObjectOrArray(value)
    ? JSON.stringify(value)
    : String(value)

  return `${printLabel}${stylePlaceholder(withCss)}${inline ? printValue : ''}`
}

export function getGroupLabel(
  type: ComponentLifecycleLabels,
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

export function getRenderFunctionProps<T>(
  props: _PrintConfig<T>,
  isRender?: boolean,
): _PrintConfig<T> | RenderProps<T> {
  if (isRender) {
    const renderProps: RenderProps<T> = {
      value: props.value,
      prevValue: props.prevValue,
      type: props.type,
      componentName: props.componentName,
      inline: props.inline,
      flags: {
        isGrouped: props.flags?.isGrouped,
        isCollapsed: props.flags?.isCollapsed,
      },
    }

    return renderProps
  }

  return props
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
  type = ComponentLifecycleLabels.Change,
  styles: { componentCSS, subValueCSS, changeCSS } = {},
  printer = {},
  logLevel = 'log',
  groupLabelRenderer,
  inline = true,
}: _PrintConfig<T>): void {
  const getCurrentPrinter = (
    method: keyof _SupportedConsole,
  ): _SupportedConsole[keyof _SupportedConsole] => getPrinter(printer, method)

  if (flags.isGrouped) {
    getCurrentPrinter(flags.isCollapsed ? 'groupCollapsed' : 'group')(
      groupLabelRenderer
        ? groupLabelRenderer(type, componentName)
        : getGroupLabel(
            type,
            componentName,
            Boolean(componentCSS),
            Boolean(subValueCSS),
          ),
      componentCSS,
      subValueCSS,
    )
  }

  const printAtLevel = (printValue: T, label?: string, css?: string): void => {
    const printer = getCurrentPrinter(logLevel)
    const message = getMessage(printValue, label, Boolean(css), inline)

    if (!css) printer(message)
    if (css) printer(message, css)
  }

  const printArDirLevel = (printValue: T): void => {
    const printer = getCurrentPrinter('dir')
    printer(printValue)
  }

  if ('prevValue' in arguments[0]) {
    printAtLevel(arguments[0].prevValue, PREVIOUS_VALUE_LABEL, subValueCSS)
    if (!inline) {
      printArDirLevel(arguments[0].prevValue)
    }

    printAtLevel(value, CURRENT_VALUE_LABEL, changeCSS)
    if (!inline) {
      printArDirLevel(value)
    }
  } else {
    printAtLevel(value, getLabel(type))
    if (!inline) {
      printArDirLevel(value)
    }
  }

  if (flags.isGrouped) getCurrentPrinter('groupEnd')()
}
