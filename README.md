<div align="center">
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
- 🪶 **Lightweight** — under *500B* gzipped
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

Comming Soon!

## Roadmap

- [ ] Add previous state checking
- [ ] Use object copy to persist in time
- [ ] Use console groups to handle all the logs
- [ ] Support SSR & Server components
- [ ] Polish the looks with component names, function calls, time etc
- [ ] TBD

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