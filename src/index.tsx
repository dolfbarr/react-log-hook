// Copyright (c) Dolf Barr <mail@dolf.me>. All rights reserved. Licensed under the MIT license.

/**
 * A react hook for logging through component lifecycle.
 *
 * @packageDocumentation
 */

import { useEffect, useRef } from 'react'
import {
  UseLogConfig,
  UseLogReturn,
  LogConfig,
  ComponentLifecycleLabels,
  _PrintConfig,
  Printer,
} from './types'
import { getComponentName, getRenderFunctionProps, print } from './utils'
import {
  ALLOWED_NODE_ENVS,
  CSS_CHANGE,
  CSS_COMPONENT,
  CSS_SUB_VALUE,
  DEFAULT_LOG_LEVEL,
} from './constants'

/**
 * Provides a function to log through react component lifecycle.
 *
 * @param config - component level configuration for any log function in the component
 * @see {@link UseLogConfig} for the config data structure
 *
 * @returns set of functions suitable for logging
 *
 * @example
 * ```ts
 * const {log} = useLog({environments: ['dev']})
 * ```
 */
export function useLog({
  styles: {
    componentCSS = CSS_COMPONENT,
    changeCSS = CSS_CHANGE,
    subValueCSS = CSS_SUB_VALUE,
  } = {},
  environments = ALLOWED_NODE_ENVS,
  isGroupingEnabled = true,
  isGroupCollapsed = false,
  printer = console as Printer,
  logLevel = DEFAULT_LOG_LEVEL,
  groupLabelRenderer,
  render,
  inline = true,
}: UseLogConfig = {}): UseLogReturn {
  const componentName = getComponentName()

  /**
   * Logging function to log through react component lifecycle.
   *
   * @param value - a value which changes will be logged
   * @typeParam T - type of the tracking value
   * @param config - component level configuration for any log function in the component
   * @see {@link LogConfig} for the config data structure
   *
   * @example
   * ```ts
   * log(someState, {environments: ['production']})
   * ```
   */
  function log<T>(value: T, config?: LogConfig): void {
    const clonedValue = JSON.parse(JSON.stringify(value)) as T
    const prevValueRef = useRef<T>()
    const printProps: Pick<
      _PrintConfig<T>,
      | 'value'
      | 'styles'
      | 'componentName'
      | 'flags'
      | 'printer'
      | 'logLevel'
      | 'groupLabelRenderer'
      | 'inline'
    > = {
      value: clonedValue,
      styles: {
        componentCSS: config?.styles?.componentCSS ?? componentCSS,
        subValueCSS: config?.styles?.subValueCSS ?? subValueCSS,
        changeCSS: config?.styles?.changeCSS ?? changeCSS,
      },
      componentName,
      flags: {
        isGrouped: config?.isGroupingEnabled ?? isGroupingEnabled,
        isCollapsed: config?.isGroupCollapsed ?? isGroupCollapsed,
      },
      printer: config?.printer ?? printer,
      logLevel: config?.logLevel ?? logLevel,
      groupLabelRenderer: config?.groupLabelRenderer ?? groupLabelRenderer,
      inline: config?.inline ?? inline,
    }

    if (environments.includes(process.env.NODE_ENV ?? 'production')) {
      function logHooks(): void {
        const isUnmounting = useRef(false)

        const printFunc = (printProps: _PrintConfig<T>): void =>
          (config?.render ?? render ?? print)(
            getRenderFunctionProps(
              printProps,
              Boolean(config?.render ?? render),
            ),
          )

        useEffect(function setIsUnmounting() {
          return function setIsUnmountingOnMount() {
            isUnmounting.current = true
          }
        }, [])

        useEffect(function onMount() {
          printFunc({
            type: ComponentLifecycleLabels.Mount,
            ...printProps,
          })

          prevValueRef.current = value

          return function onUnmount() {
            printFunc({
              type: ComponentLifecycleLabels.Unmount,
              prevValue: prevValueRef.current,
              ...printProps,
            })
          }
        }, [])

        useEffect(
          function onChange() {
            printFunc({
              type: ComponentLifecycleLabels.Change,
              prevValue: prevValueRef.current,
              ...printProps,
            })

            prevValueRef.current = value
          },
          [value],
        )
      }

      return logHooks()
    }
  }

  return { log }
}
