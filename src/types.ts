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
export interface UseLogConfig {
  /** Contains styles object with different CSS inline styles used in logging */
  styles?: Styles
  /** Contains array of environments of `process.env.NODE_ENV` in which logging will be allowed  */
  environments?: string[]
}

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
  group?: string
  type?: _PrintTypes
  styles?: Styles
  componentName: string
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
