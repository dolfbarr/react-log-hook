import { useEffect, useRef } from 'react'

const CSS_COMPONENT = 'color: DodgerBlue'
const CSS_CHANGE = 'color: green; font-weight: bold;'
const CSS_SUB_VALUE = 'color: SlateGray; font-weight: thin;'

const ALLOWED_NODE_ENVS = ['dev', 'development']

export interface UseLogReturn {
  log: <T>(value: T) => void
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

export function useLog(): UseLogReturn {
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

  const getGroupLabel = (type: PrintTypes): string => {
    return `${String(type)} ${
      componentName ? 'in %c<' + String(componentName) + ' /> ' : '%c'
    }%c@ ${new Date().toLocaleTimeString()}`
  }

  function print<T>({
    value,
    label,
    prevValue,
    type = PrintTypes.Change,
    group = getGroupLabel(type),
  }: PrintProps<T>): void {
    console.group(group, CSS_COMPONENT, CSS_SUB_VALUE)

    if (!('prevValue' in arguments[0])) {
      console.log(`${label.padStart(14, ' ')}: ${String(value)}`)
    } else {
      console.log(
        `Previous value: %c${String(arguments[0].prevValue)}`,
        CSS_SUB_VALUE,
      )
      console.log(` Current value: %c${String(value)}`, CSS_CHANGE)
    }

    console.groupEnd()
  }

  function log<T>(value: T): void {
    const clonedValue = JSON.parse(JSON.stringify(value))
    const prevValueRef = useRef<T>()

    if (ALLOWED_NODE_ENVS.includes(process.env.NODE_ENV ?? '')) {
      return (() => {
        const isUnmounting = useRef(false)
        useEffect(() => {
          return () => {
            isUnmounting.current = true
          }
        }, [])

        useEffect(() => {
          print({
            label: 'On mount',
            value: clonedValue,
            type: PrintTypes.Mount,
          })

          prevValueRef.current = value

          return () => {
            print({
              label: 'On unmount',
              value: clonedValue,
              type: PrintTypes.Unmount,
              prevValue: prevValueRef.current,
            })
          }
        }, [])

        useEffect(() => {
          print({
            label: 'On change',
            value: clonedValue,
            type: PrintTypes.Change,
            prevValue: prevValueRef.current,
          })

          prevValueRef.current = value
        }, [value])
      })()
    }
  }

  return { log }
}
