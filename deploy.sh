#!/usr/bin/env sh

set -e

yarn build

cd dist

git init
git checkout -b main
git add -A
git commit -m 'deploy'
git push -f git@github.com:aleris/category-colors.git main:gh-pages

cd -
