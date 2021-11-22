## @exodus/exchange-ui

Exodus exchange form hooks and components

## Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Hooks](#hooks)

## Installation

```sh
yarn add @exodus/ftx
```

## Development

Linking a local copy of dependency on both wallets can be a bit tricky. That's mostly because the React Native packager doesn't support symlinks, causing the `npm link` command to fail.

That's why this package ships a `yarn watch <target>` script that watches for file changes and maintains a copy of the package source into the wallet's `node_modules` folder.

Usage:

```sh
yarn watch <exodus-mobile-dir> # For Mobile wallet.

yarn watch <exodus-desktop-dir>/src # For Desktop wallet. Should be linked inside 'src'
```

## Hooks

### UseExchange 

Hook creates exchange state, calculates amounts, returns callbacks.
Accepts data from client-side state 