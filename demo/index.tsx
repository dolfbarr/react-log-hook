import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '../src/index.stories'

const container = document.getElementById('app')
const root = createRoot(container)
root.render(<App />)
