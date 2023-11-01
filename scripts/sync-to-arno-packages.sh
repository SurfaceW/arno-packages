#!/bin/bash

# Get the current directory
work_dir=$(pwd)
# --dir=xxx dir need to be synced with
dir=""

# Parse command line arguments
while (("$#")); do
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
echo "work dir: ${work_dir}"
echo "operate dir: ${dir}"

echo "🚀 now remove local git repo related packages"

# Iterate over all files and directories in the current directory
for file in "$work_dir"/*; do
    # Check if the file is not the .git folder
    if [[ "$file" != "$work_dir/.git" && "$file" != "$work_dir/scripts" ]]; then
        # Remove the file or directory
        rm -rf "$file"
        echo "rm: $file"
    fi
done

echo "✅ done: remove local git repo related packages"

echo "🚀 now copy from target dir: ${dir}/pacakges"

# # Copy all files and directories from packages to arno-packages directory except node_modules
rsync -av --progress "${dir}/packages/" "${work_dir}" --exclude 'node_modules'

echo "✅ done: sync from arno-packages done"
