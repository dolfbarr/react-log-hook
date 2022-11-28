import { useEffect, useRef } from 'react'

const CSS_COMPONENT = 'color: DodgerBlue'
const CSS_CHANGE = 'color: green; font-weight: bold;'
const CSS_SUB_VALUE = 'color: SlateGray; font-weight: thin;'

const ALLOWED_NODE_ENVS = ['dev', 'development']

export interface UseLog {
  styles?: {
    componentCSS?: string
    changeCSS?: string
    subValueCSS?: string
  }
}

export type Log = UseLog

export interface UseLogReturn {
  log: <T>(value: T, props?: Log) => void
}

interface PrintProps<T> {
  value: T
  prevValue?: T
  label: string
  group?: string
  type?: PrintTypes
}

export enum PrintTypes {
  Mount = 'Mount',
  Unmount = 'Unmount',
  Change = 'Change',
}

export function useLog({
  styles: {
    componentCSS = CSS_COMPONENT,
    changeCSS = CSS_CHANGE,
    subValueCSS = CSS_SUB_VALUE,
  } = {},
}: UseLog = {}): UseLogReturn {
  const componentName =
    (function getComponentName() {
      try {
        throw new Error()
      } catch (error) {
        if (error instanceof Error) {
          const re = /(\w+)@|at (\w+) \(/g

          re.exec(error?.stack ?? '')
          re.exec(error?.stack ?? '')
          const m = re.exec(error?.stack ?? '') ?? []

          return String(m[1] || m[2])
        }
      }
    })() ?? ''

  function getGroupLabel(type: PrintTypes): string {
    return `${String(type)} ${
      componentName ? 'in %c<' + String(componentName) + ' /> ' : '%c'
    }%c@ ${new Date().toLocaleTimeString()}`
  }

  function log<T>(value: T, props?: Log): void {
    const clonedValue = JSON.parse(JSON.stringify(value))
    const prevValueRef = useRef<T>()

    function print<T>({
      value,
      label,
      prevValue,
      type = PrintTypes.Change,
      group = getGroupLabel(type),
    }: PrintProps<T>): void {
      console.group(
        group,
        props?.styles?.componentCSS ?? componentCSS,
        props?.styles?.subValueCSS ?? subValueCSS,
      )

      if (!('prevValue' in arguments[0])) {
        console.log(`${label.padStart(14, ' ')}: ${String(value)}`)
      } else {
        console.log(
          `Previous value: %c${String(arguments[0].prevValue)}`,
          props?.styles?.subValueCSS ?? subValueCSS,
        )
        console.log(
          ` Current value: %c${String(value)}`,
          props?.styles?.changeCSS ?? changeCSS,
        )
      }

      console.groupEnd()
    }

    if (ALLOWED_NODE_ENVS.includes(process.env.NODE_ENV ?? '')) {
      return (function logHooks() {
        const isUnmounting = useRef(false)
        useEffect(function setIsUnmounting() {
          return function setIsUnmountingOnMount() {
            isUnmounting.current = true
          }
        }, [])

        useEffect(function onMount() {
          print({
            label: 'On mount',
            value: clonedValue,
            type: PrintTypes.Mount,
          })

          prevValueRef.current = value

          return function onUnmount() {
            print({
              label: 'On unmount',
              value: clonedValue,
              type: PrintTypes.Unmount,
              prevValue: prevValueRef.current,
            })
          }
        }, [])

        useEffect(
          function onChange() {
            print({
              label: 'On change',
              value: clonedValue,
              type: PrintTypes.Change,
              prevValue: prevValueRef.current,
            })

            prevValueRef.current = value
          },
          [value],
        )
      })()
    }
  }

  return { log }
}
