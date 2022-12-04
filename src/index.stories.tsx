import React, { useEffect, useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import '@storybook/addon-console'
import '@storybook/addon-actions/register'
import { useLog } from '.'

export function App(): React.ReactElement {
  const [isExampleMounted, setIsExampleMounted] = useState<boolean>(true)

  setTimeout(function setIsMounted() {
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

export function ExampleComponent(): React.ReactElement {
  const { log } = useLog()
  const [currentState, setCurrentState] = useState<object>({})

  log(currentState)

  useEffect(function setStateMount() {
    setCurrentState({ a: 'Test', b: 'Value', state: 'OnMount' })

    setTimeout(function setStateChange1() {
      setCurrentState({ a: 'Test', b: 'Value', state: 'onChange 1s' })
    }, 1000)

    setTimeout(function setStateChange2() {
      setCurrentState({ a: 'Test', b: 'Value', state: 'onChange 2s' })
    }, 2000)

    return function setStateUnmount() {
      setCurrentState({ a: 'Test', b: 'Value', state: 'onUnmount' })
    }
  }, [])

  return <p>Test Component: {JSON.stringify(currentState)}</p>
}

const DefaultMeta: ComponentMeta<typeof App> = {
  title: 'Example',
  component: App,
  parameters: {
    layout: 'centered',
  },
}

export default DefaultMeta
