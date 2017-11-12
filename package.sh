#!/usr/bin/env bash
git status
composer.phar install
rm -rf vendor/phan/phan/.git
composer.phar dump-autoload -o -a
