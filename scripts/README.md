# Scripts Package

Contains scripts for syncing packages with a remote repository.

## Available Scripts

- `sync-from-arno-packages.sh`: Syncs from the `arno-packages` GitHub repository. You have to pull from `main` and update it directly. This script will remove all source code and copy it directly from the current directory of the parent folder.
- `sync-to-arno-packages.sh`: Syncs to the `arno-packages` GitHub repository. This will copy the `packages` directory to its parent folder named `arno-packages`. You then have to manually commit and push to the GitHub repository.