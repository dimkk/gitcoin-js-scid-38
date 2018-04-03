# grotesque 2018

## having to transpile code from web.3 packages to es2015 whilst using create react app

Usage:
```
git clone
yarn
yarn start - you should see that ipfs is ready
yarn build - you should see fail
node grotesque - take some time
yarn build - you should see success
yarn serve - to check if ipfs ready on production build
```

But it will fail - even if you will be able to build without errors - it will fail on loading in browser if you are on Windows, if on Mac - it will fail first time, then it will start working.

.grotesque - settings, pass there an array of packages to transpile, if its just a name - it will recursevly tries to transpile it, if its "..[package]" it will transpile not main section of package.json, but parent, and finally, you can pass "./node_modules/[package1]/node_modules/[package2]/src" - to transpile direct folder