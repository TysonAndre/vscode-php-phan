Contributing
============

Clone this whole repository and in the root directory execute:

```bash
composer install
npm install
npm run build
code .
```

The last command will open the folder in VS Code. Hit `F5` to launch an Extension Development Host with the extension.
For working on the Phan language server, the easiest way is to override your config for the Phan language server installation from composer to point to the phan script within a git checkout of phan (Must set it up with `composer install` inside that checkout.).

First, checkout and setup a phan installation.

```sh
# Replace the placeholders /path/to/folder and phan_git_checkout with the folders you plan to use.

cd /path/to/folder/
git clone git@github.com:phan/phan phan_git_checkout
# Optionally, check out the branch being developed
# git checkout master
cd /path/to/folder/phan_git_checkout
composer install
```

And then point to that phan installation:

```javascript
{
    "phan.phanScriptPath": "/path/to/folder/phan_git_checkout/phan"
}
```

For guidance on how to set up a Phan project, please see [phan/phan](https://github.com/phan/phan), and the article [Getting Started](https://github.com/phan/phan/wiki/Getting-Started)
