import { useEffect, useRef } from 'react'

const CSS_COMPONENT = 'color: DodgerBlue'
const CSS_DATE = 'color: SlateGray;'

export interface UseLogReturn {
  log: <T>(value: T) => void
}

interface PrintProps<T> {
  value: T
  label: string
  group?: string
  type?: PrintTypes
}

export enum PrintTypes {
  Mount = 'Mount',
  Unmount = 'Unmount',
  BeforeUnmount = 'Before unmount',
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
    type = PrintTypes.Change,
    group = getGroupLabel(type),
  }: PrintProps<T>): void {
    console.group(group, CSS_COMPONENT, CSS_DATE)
    console.log(`${label}: ${String(value)}`)
    console.groupEnd()
  }

  function log<T>(value: T): void {
    const clonedValue = JSON.parse(JSON.stringify(value))

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

        return () => {
          print({
            label: 'On unmount',
            value: clonedValue,
            type: PrintTypes.Unmount,
          })
        }
      }, [])

      useEffect(() => {
        print({
          label: 'On change',
          value: clonedValue,
          type: PrintTypes.Change,
        })

        return () => {
          if (isUnmounting.current) {
            print({
              label: 'Before unmount',
              value: clonedValue,
              type: PrintTypes.BeforeUnmount,
            })
          }
        }
      }, [value])
    })()
  }

  return { log }
}
