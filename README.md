# Arno Packages

- public packages for Arno's projects and experiments also for best-practices sharing
- packages shall publish to npm with `@arno/*` scope

## Usage

use git sub-module to manage this project in the parent project.

## Env Setup

- `node.js` >= 18.19.1
- `turbo-repo` >= 2.5.3 (monorepo management tool)
- `pnpm` >= 10.6.5 (package manager)
- `next.js` >= 14.2.17 (server-side rendering framework, peer dependency)
- `typescript` >= 5.2.2 (peer dependency)

## Directory Structure

- `client/`: Contains packages for browser-context projects.
- `eslint-config-custom/`: Contains shared ESLint configurations.
- `scripts/`: Contains scripts for syncing packages with a remote repository.
- `server/`: Contains packages for Node.js and Next.js powered projects.
- `shared/`: Contains basic shared packages for client and server, for pure TypeScript/JavaScript projects.
- `tsconfig/`: Contains shared tsconfig.json files for different project types.
- `ui/`: Contains shared UI components, likely based on React and Ant Design.

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

- [x] add `unit` test CI for all packages
- [x] add publish CI for all packages when commit and merge to `main` branch
