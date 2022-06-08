#!/usr/bin/env sh

set -e

yarn build

cd dist

git switch main
git add -A
git commit -m 'deploy'

git subtree push --prefix dist origin gh-pages

cd -
