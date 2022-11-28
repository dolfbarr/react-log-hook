import { useEffect, useRef } from 'react'
import { UseLog, UseLogReturn, Log, PrintTypes, PrintProps } from './types'
import { getComponentName, print } from './utils'

const CSS_COMPONENT = 'color: DodgerBlue'
const CSS_CHANGE = 'color: green; font-weight: bold;'
const CSS_SUB_VALUE = 'color: SlateGray; font-weight: thin;'

const ALLOWED_NODE_ENVS = ['dev', 'development']

export function useLog({
  styles: {
    componentCSS = CSS_COMPONENT,
    changeCSS = CSS_CHANGE,
    subValueCSS = CSS_SUB_VALUE,
  } = {},
  environments = ALLOWED_NODE_ENVS,
}: UseLog = {}): UseLogReturn {
  const componentName = getComponentName()

  function log<T>(value: T, props?: Log): void {
    const clonedValue = JSON.parse(JSON.stringify(value)) as T
    const prevValueRef = useRef<T>()
    const printProps: Pick<
      PrintProps<T>,
      'value' | 'styles' | 'componentName'
    > = {
      value: clonedValue,
      styles: {
        componentCSS: props?.styles?.componentCSS ?? componentCSS,
        subValueCSS: props?.styles?.subValueCSS ?? subValueCSS,
        changeCSS: props?.styles?.changeCSS ?? changeCSS,
      },
      componentName,
    }

    if (environments.includes(process.env.NODE_ENV ?? 'production')) {
      function logHooks(): void {
        const isUnmounting = useRef(false)
        useEffect(function setIsUnmounting() {
          return function setIsUnmountingOnMount() {
            isUnmounting.current = true
          }
        }, [])

        useEffect(function onMount() {
          print({
            label: 'On mount',
            type: PrintTypes.Mount,
            ...printProps,
          })

          prevValueRef.current = value

          return function onUnmount() {
            print({
              label: 'On unmount',
              type: PrintTypes.Unmount,
              prevValue: prevValueRef.current,
              ...printProps,
            })
          }
        }, [])

        useEffect(
          function onChange() {
            print({
              label: 'On change',
              type: PrintTypes.Change,
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
