# Arno Packages

- public packages for Arno's projects and experiments also for best-practices sharing
- packages shall publish to npm with `@arno/*` scope

## Usage

* use git sub-module to manage this project in the parent project.

```bash
git submodule add https://github.com/SurfaceW/arno-packages.git e-studio-base
```

* add pnpm workspace to include the packages `pnpm-workspace.yaml`

```yaml
packages:
  - "packages/*"
  - "e-studio-base/*"
  # exclude packages that are inside test directories
  - '!**/test/**'
```

add dependencies to the parent project `package.json`

```json
{
  "dependencies": {
    "@arno/client": "workspace:*",
    "@arno/server": "workspace:*",
    "@arno/shared": "workspace:*",
    "@arno/ui": "workspace:*",
  }
}
```

## Env Setup

- `node.js` >= 18.0.0
- `turbo-repo` as monorepo management tool
- `pnpm` as package manager
- `next.js` as server-side rendering framework as peer dependency which version is >= 13.5.0
- `typescript` as peer dependency which version is >= 5.2.0

## Directory Structure

- `packages/`: packages
  - `scripts`: scripts for shared packages development
  - `shared`: client and server basic shared packages
  - `client`: client packages
  - `server`: server packages
  - `ui`: ui packages(react-based components for share)
  - `tsconfig`: tsconfig for shared packages
  - `eslint-config-custom`: eslint config for shared packages

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
- [ ] remove specific ui-libs out from the base package such as `antd`
- [ ] upgrade eslint and shared tsconfig to latest version