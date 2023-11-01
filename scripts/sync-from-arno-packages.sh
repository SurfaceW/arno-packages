#!/bin/bash

# --dir=xxx dir need to be synced with
dir=""

# Parse command line arguments
while (( "$#" )); do
  case "$1" in
    --dir=*)
      dir="${1#*=}"
      shift
      ;;
    *) # Preserve any positional arguments
      shift
      ;;
  esac
done

# Convert relative path to absolute path
cd "$dir"
dir=$(pwd)

# Print the argument
echo "operate dir: ${dir}"

# sync from arno packages from remote git repos
# WIP :)

# # remove local packages and copy from arno-packages
echo "🚀 now remove local packages"
rm -rf "${dir}/packages"
echo "✅ done: remove ${dir}'s local packages"

echo "🚀 now copy from arno-packages"
cp -r ../arno-packages "${dir}/packages"
echo "✅ done: copy from arno-packages done"

# # remove .git folder to make it a local repo
echo "🚀 now remove .git folder"
rm -rf "${dir}/packages/.git"
echo "✅ done: sync from arno-packages done"

# # reinstall node_modules
echo "🚀 now reinstall new depencies inside ${dir}"
cd "${dir}"

if command -v pnpm &> /dev/null; then
  pnpm i
elif command -v npm &> /dev/null; then
  npm i
elif command -v yarn &> /dev/null; then
  yarn
else
  echo "No package manager (pnpm, npm, or yarn) found. Please install one."
  exit 1
fi

echo "🎉 finished"