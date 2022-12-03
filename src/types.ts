export interface Styles {
  /**
   * Inline css for rendering component name in the logs
   *
   * @defaultValue Blue text color
   *
   * @example
   * ```css
   * color:green;font-weight:bold;background-color:black;
   * ```
   */
  componentCSS?: string
  /**
   * Inline css for rendering current value in the logs
   *
   * @defaultValue Green text color with bold font
   *
   * @example
   * ```css
   * color:green;font-weight:bold;background-color:black;
   * ```
   */
  changeCSS?: string
  /**
   * Inline css for rendering any additional data like time or previous value in the logs
   *
   * @defaultValue Gray text color with thin font
   *
   * @example
   * ```css
   * color:green;font-weight:bold;background-color:black;
   * ```
   */
  subValueCSS?: string
}

/** Describes configuration object at component level */
export type UseLogConfig = {
  /** Contains styles object with different CSS inline styles used in logging */
  styles?: Styles
  /** Contains array of environments of `process.env.NODE_ENV` in which logging will be allowed  */
  environments?: string[]
  /** Contains custom implementation of console  */
  printer?: Printer | Console
  logLevel?: LogLevels
} & (
  | {
      /** Enable grouping for logs  */
      isGroupingEnabled?: boolean
      /** Render groups collapsed  */
      isGroupCollapsed?: boolean
    }
  | {
      /** Enable grouping for logs  */
      isGroupingEnabled?: false
      /** Render groups collapsed  */
      isGroupCollapsed?: never
    }
)

/** Describes configuration object at call level, can be used to override configuration */
export type LogConfig = UseLogConfig

/** Return value of `useLog` hook */
export interface UseLogReturn {
  /** Used for logging per component lifecycle */
  log: <T>(value: T, props?: LogConfig) => void
}

/**
 * Describes configuration object of the inner print function
 * @internal
 *
 * @typeParam T - type of the tracking value
 */
export interface _PrintConfig<T> {
  value: T
  prevValue?: T
  label: string
  type?: _PrintTypes
  styles?: Styles
  componentName: string
  flags?: _PrintFlags
  printer?: Printer | Console
  logLevel?: LogLevels
}

/**
 * Describes possible flags for internal print configuration
 * @internal
 */
export type _PrintFlags =
  | {
      isGrouped?: boolean
      isCollapsed?: boolean
    }
  | {
      isGrouped?: false
      isCollapsed?: never
    }

/**
 * Label types of print groups
 * @internal
 */
export enum _PrintTypes {
  Mount = 'Mount',
  Unmount = 'Unmount',
  Change = 'Change',
}

/** Supported log levels which can be used in the console or custom console implementation */
export type LogLevels = keyof Pick<
  Console,
  'log' | 'info' | 'error' | 'warn' | 'debug'
>

/**
 * Supported console methods
 * @internal
 */
export type _SupportedConsole = Pick<
  Console,
  'group' | 'groupCollapsed' | 'groupEnd' | LogLevels
>

/** Describes custom implementation of console object with only supported methods used to render logs */
export type Printer = Partial<_SupportedConsole>
