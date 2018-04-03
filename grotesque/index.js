const checker = require('./es5-checker')
var path = require('path')
var appDir = process.cwd()
const fs = require('fs')
const exec = require('child_process').exec;
const babel = appDir + '/node_modules/.bin/babel '
let cache = []

const checkMain = (appDir, p, includeParentFolder, resolve) => {
    
    
    const pdir = appDir + "/node_modules/" + p
    console.log("checking package " + pdir)
    if (cache.indexOf(pdir) != -1) return
    cache.push(pdir) 
    fs.readFile(pdir + "/package.json", (err, pjs) => {

        if (err) {console.log(err);return} //throw "no module found"
        const pjson = JSON.parse(pjs)

        function rec() {
            for (property in pjson.dependencies) {
                console.log(p + " deps " + property)
                checkMain(appDir, property, false, resolve)
                checkMain(pdir, property, false, resolve)
            }
        }

        if (!pjson.main) rec() 
        else {
            const main = !includeParentFolder
                ? pdir + "/" + path.parse(pjson.main).dir
                : pdir + "/" + path.join(path.parse(pjson.main).dir , "..")
            console.log("main section - " + main)
            const errors = checker("es5", [main + "/**/*.js"])
            if (errors.length > 0) {
                console.log("fixing")
                let dotnetPs = exec(babel + main + ' -d ' + main, () => {resolve()})
                dotnetPs.stdout.on("data", function(data) { 
                    console.log(data.toString()); 
                });
                dotnetPs.stderr.on("data", function(data) { 
                    console.error(data.toString()); 
                });
                

            }

            
            rec()
        }
        
    })
}
console.log(appDir)
function gogo() {
    return new Promise((resolve, reject) => {
        fs.readFile(appDir + "/.grotesque", (err, data) => {
            if (err) throw "no .grotesque file with array of npm modules provided"
            packages = JSON.parse(data)
            packages.forEach(p => {
                let includeParentFolder = false
                if (p.indexOf("..") != -1) {
                    includeParentFolder = true
                    p = p.replace(/../, "")
                }
                checkMain(appDir, p, includeParentFolder, resolve)
            });
            
        })
        
    })
}

gogo().then(() => {
    //fs.writeFile(appDir + "/.grotescure_cache.json", JSON.stringify(cache))
    this.setTimeout(() => {console.log('finish')}, 20000)
})