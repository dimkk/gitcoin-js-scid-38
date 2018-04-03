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
yarn serve
open browser - goto localhost:8008 - to check if ipfs ready on production build
```

If yarn build fails after grotesque, run it another time.
If it's not help - add package to .grotesque - and run again

Settings:
.grotesque - settings, pass there an array of packages to transpile, if its just a name - it will recursevly tries to transpile it, if its "..[package]" it will transpile not main section of package.json, but parent, and finally, you can pass "./node_modules/[package1]/node_modules/[package2]/src" - to transpile direct folder