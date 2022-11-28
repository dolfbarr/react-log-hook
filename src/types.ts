export interface Styles {
  componentCSS?: string
  changeCSS?: string
  subValueCSS?: string
}

export interface UseLog {
  styles?: Styles
  environments?: string[]
}

export type Log = UseLog

export interface UseLogReturn {
  log: <T>(value: T, props?: Log) => void
}

export interface PrintProps<T> {
  value: T
  prevValue?: T
  label: string
  group?: string
  type?: PrintTypes
  styles?: Styles
  componentName: string
}

export enum PrintTypes {
  Mount = 'Mount',
  Unmount = 'Unmount',
  Change = 'Change',
}
