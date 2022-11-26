import React, { useEffect, useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import '@storybook/addon-console'
import '@storybook/addon-actions/register'
import { useLog } from '.'

export const App = (): React.ReactElement => {
  const [isExampleMounted, setIsExampleMounted] = useState<boolean>(true)

  setTimeout(() => {
    setIsExampleMounted(false)
  }, 3000)

  return (
    <div>
      <p>Demo for React log hook.</p>
      <p>Please check the console for logs.</p>
      {isExampleMounted ? <ExampleComponent /> : null}
    </div>
  )
}

export const ExampleComponent = (): React.ReactElement => {
  const { log } = useLog()
  const [state, setState] = useState<string | null>(null)

  log(state)

  useEffect(() => {
    setState('onMount')

    setTimeout(() => {
      setState('onChange 1s')
    }, 1000)

    setTimeout(() => {
      setState('onChange 2s')
    }, 2000)

    return () => {
      setState('onUnmount')
    }
  }, [])

  return <p>Test Component: {state}</p>
}

const DefaultMeta: ComponentMeta<typeof App> = {
  title: 'Example',
  component: App,
  parameters: {
    layout: 'centered',
  },
}

export default DefaultMeta
