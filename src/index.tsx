import { useEffect } from 'react'

export interface UseLogReturn {
  log: <T>(value: T) => void
}

export const useLog = (): UseLogReturn => {
  function log<T>(value: T): void {
    return (() => {
      useEffect(() => {
        console.log(`On mount: ${String(value)}`)

        return () => {
          console.log(`On unmount: ${String(value)}`)
        }
      }, [])

      useEffect(() => {
        console.log(`On change: ${String(value)}`)
      }, [value])
    })()
  }

  return { log }
}
