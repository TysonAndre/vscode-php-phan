#!/usr/bin/env bash
set -xeu
git status
composer.phar install
rm -rf vendor/phan/phan/.git
composer.phar dump-autoload -o -a
node_modules/.bin/vsce package
