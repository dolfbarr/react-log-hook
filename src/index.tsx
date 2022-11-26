import { useEffect, useRef } from 'react'

export interface UseLogReturn {
  log: <T>(value: T) => void
}

export const useLog = (): UseLogReturn => {
  function log<T>(value: T): void {
    return (() => {
      const isUnmounting = useRef(false)
      useEffect(() => {
        return () => {
          isUnmounting.current = true
        }
      }, [])

      useEffect(() => {
        console.log(`On mount: ${String(value)}`)

        return () => {
          console.log(`On unmount: ${String(value)}`)
        }
      }, [])

      useEffect(() => {
        console.log(`On change: ${String(value)}`)

        return () => {
          if (isUnmounting.current) {
            console.log(`Before unmount: ${String(value)}`)
          }
        }
      }, [value])
    })()
  }

  return { log }
}
