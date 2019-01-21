#!/usr/bin/env bash
set -xeu
git status
composer.phar install
rm -rf vendor/phan/phan/{.git,tests}
node_modules/.bin/vsce package
