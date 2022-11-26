import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '../src/index.stories'

const container = document.getElementById('app')
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!)
root.render(<App />)
