#!/usr/bin/env sh

set -e

yarn build

cd dist

git init
git switch main
git add -A
git commit -m 'deploy'
git push -f git@github.com:aleris/category-colors.git main:gh-pages

cd -
