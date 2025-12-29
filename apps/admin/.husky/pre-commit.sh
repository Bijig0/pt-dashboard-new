#!/bin/sh

# Get the current branch name
branch=$(git symbolic-ref --short HEAD)

# Run the hook only on the main branch
if [ "$branch" = "main" ]; then
  echo "Running tests on main branch"
  npm run test
  # Capture the exit status of the test command
  status=$?
  # Exit with the test command's status
  exit $status
else
  echo "Skipping tests on branch $branch"
fi
