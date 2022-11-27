<div align="center">
  <div align="center">
  <img src="./react-log-hook-screenshot.png" alt="React Log Hook Screenshot" width=400 />
  <br>
  <br>
  </div>
  <img src="https://badgen.net/npm/v/react-log-hook" alt="NPM Version" />
   <img src="https://badgen.net/npm/license/react-log-hook" alt="License" />
  <img src="https://badgen.net/bundlephobia/minzip/react-log-hook" alt="minzipped size"/>
  <img src="https://badgen.net/bundlephobia/dependency-count/react-log-hook" alt="dependency count"/>
  <img src="https://github.com/dolfbarr/react-log-hook/actions/workflows/main.yml/badge.svg" alt="Build Status" />
  <img src="https://badgen.net/github/last-commit/dolfbarr/react-log-hook/main" alt="Last Commit" />
  <br>
  <br>
  <div align="center"><strong>🪵 React Log Hook</strong></div>
  <div align="center"> Lightweight & customizable logging hook for your react components lifecycle</div>

  <div align="center">
  <sub>By <a href="https://twitter.com/dolfbarr">Dolf Barr</a></sub>
  </div>
  <br>
  <br>
  <br>
</div>

# 🪵 react-log-hook
React hook for logging per component lifecycle

## Features
- 🪶 **Lightweight** — under *1Kb* gzipped
- 🗂️ **Typed** — made with TypeScript, ships with types
- 🥰 **Simple** — don't worry about any changes in your props & state
- 🔧 **Customizable** — work in progress 😉
- 🔬 **Tested** — up to 100% coverage
- 🏎️ **Fast** — native react hooks & optimized
- 📭 **No dependecies**



## Install

With npm

```sh
npm install react-log-hook
```

With yarn

```sh
yarn add react-log-hook
```

## Usage

```javascript
import {useLog} from 'react-log-hook'

const App = () => {
  // Add a logger
  const {log} = useLog()

  const [state, setState] = useState(null)

  // Log the changes via console in real time!
  log(state)

  return null
}
```

## FAQ

### Will it deep copy the value to make sure it will persist in the logs?

- 🎉 Yes, 🪵 **react-log-hook** deep copies the value to make sure it will not be changed in the logs later

### Do i need to install @types/react-log-hook as well?

- 💪 No, 🪵 **react-log-hook** comes with prebundled types

### Will it run in production evironment?

- ✅ By default 🪵 **react-log-hook** will run only in `dev` or `development` node evironments defined by `NODE_ENV`

## Roadmap

- [x] Add previous state checking
- [x] Use object copy to persist in time
- [x] Use console groups to handle all the logs
- [x] Add dev environment support by default
- [x] Polish the looks with component names, function calls, time etc
- [ ] Add more customization options
- [ ] Support SSR & Server components

## Contributing

- 🌟 Stars & 📥 Pull Requests are welcome for sure! ❤️

### Development

🪵 **react-log-hook** uses npm & npm scripts in development, the following scipts can be handy:

#### `npm run start:demo`
> Starts a demo app with enabled hook to check it in real environment

#### `npm run storybook`
> Starts storybook with exmaple components to test against

#### `npm run release:check`
> Combination of linting, type-checking & tests; runs as precommit hook

## License

[MIT License](LICENSE)