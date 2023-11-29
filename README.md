# Arno Packages 2

- public packages for Arno's projects and experiments
- packages shall publish to npm with `@arno/*` scope

## Usage

- update this project from target project: `sh ./scripts/sync-to-arno-packages.sh <dir 2 project>`
- sync this project to target project: `sh ./scripts/sync-from-arno-packages.sh <dir 2 project>`

## Env Setup

- `node.js` >= 18.0.0
- `turbo-repo` as monorepo management tool
- `pnpm` as package manager
- `next.js` as server-side rendering framework as peer dependency which version is >= 13.5.0
- `typescript` as peer dependency which version is >= 5.2.0

## Directory Structure

- `packages/`: packages
  - `shared`: client and server basic shared packages
  - `client`: client packages
  - `server`: server packages
  - `ui`: ui packages(react-based components for share)

## Dev Guide

use turbo repo to manage monorepo architecture.

- `pnpm install`: install dependencies
- `pnpm run build`: build all packages
- `pnpm run lint`: lint all packages
- `pnpm run test`: test all packages
- `pnpm run publish`: publish all packages


## Github Actions & CI

> WIP

## Future plans

- [ ] add `unit` test CI for all packages
- [ ] add publish CI for all packages when commit and merge to `main` branch
