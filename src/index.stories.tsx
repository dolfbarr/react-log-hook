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
  const { log } = useLog({ styles: { componentCSS: 'color: darkBlue;' } })
  const [state, setState] = useState<string | null>(null)
  const [anotherState, setAnotherState] = useState<string | null>(null)

  log(state)
  log(anotherState, { styles: { componentCSS: 'color: darkRed;' } })

  useEffect(function setStateMount() {
    setState('onMount')
    setAnotherState('onMount')

    setTimeout(function setStateChange1() {
      setState('onChange 1s')
    }, 1000)

    setTimeout(function setStateChange2() {
      setState('onChange 2s')
    }, 2000)

    return function setStateUnmount() {
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
