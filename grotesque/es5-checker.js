const prog = require('caporal')
const acorn = require('acorn')
const glob = require('glob')
const fs = require('fs')

module.exports = (ecmaVersion, f) => {

    const v = ecmaVersion
    const files = f
    let e
    // define ecmaScript version
    switch (v) {
        case 'es3':
            e = '3'
            break
        case 'es4':
            e = '4'
            break
        case 'es5':
            e = '5'
            break
        case 'es6':
            e = '6'
            break
        case 'es7':
            e = '7'
            break
        case 'es8':
            e = '8'
            break
        case 'es2015':
            e = '5'
            break
        case 'es2016':
            e = '6'
            break
        case 'es2017':
            e = '7'
            break
        case 'es2018':
            e = '8'
            break
        default:
            e = '5'
    }

    const errArray = []
    const globOpts = { nodir: true }
    const acornOpts = { ecmaVersion: e, silent: false }

    files.forEach((pattern) => {
        // pattern => glob or array
        const globbedFiles = glob.sync(pattern, globOpts)

        globbedFiles.forEach((file) => {
            console.log("checking " + file)
            const code = fs.readFileSync(file, 'utf8')
            try {
                acorn.parse(code, acornOpts)
            } catch (err) {
                //logger.debug(`ES-Check: failed to parse file: ${file} \n - error: ${err}`)
                const errorObj = {
                    //err,
                    //stack: err.stack,
                    file,
                }
                console.log('got error' + errorObj.file)
                errArray.push(errorObj)
            }
            //console.log("no error")
        })
    })

    return errArray
}