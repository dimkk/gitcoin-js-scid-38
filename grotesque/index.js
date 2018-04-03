const checker = require('./es5-checker')
var path = require('path')
var appDir = process.cwd()
const fs = require('fs')
const exec = require('child_process').exec;
const babel = appDir + '/node_modules/.bin/babel '
let cache = []

const checkMain = (appDir, p, includeParentFolder, directPath) => {

    if (directPath) {
        checkAndTranspile(directPath)
        return;
    }

    const pdir = appDir + "/node_modules/" + p
    console.log("checking package " + pdir)
    //if (cache.indexOf(pdir) != -1) return
    cache.push(pdir)
    let pjs
    try{
        pjs = fs.readFileSync(pdir + "/package.json")
    } catch(err) {
        return
    }
    //if (err) { console.log(err); return } //throw "no module found"
    let pjson
    try {
        pjson = JSON.parse(pjs)
    } catch(err) {
        console.log(err)
        pjson = {main: false}
    }
        

    function rec() {
        for (property in pjson.dependencies) {
            console.log(p + " deps " + property)
            checkMain(pdir, property)
            checkMain(appDir, property)
        }
    }

    if (!pjson.main) rec()
    else {
        const main = !includeParentFolder
            ? pdir + "/" + path.parse(pjson.main).dir
            : pdir + "/" + path.join(path.parse(pjson.main).dir, "..")
        console.log("main section - " + main)

        checkAndTranspile(main)


        rec()
    }

}
console.log(appDir)

function checkAndTranspile(main){
    const errors = checker("es5", [main + "/**/*.js"])
    if (errors.length > 0) {
        console.log("fixing")
        let dotnetPs = exec(babel + main + ' -d ' + main +' --presets "es2015"')
        dotnetPs.stdout.on("data", function (data) {
            console.log(data.toString());
        });
        dotnetPs.stderr.on("data", function (data) {
            console.error(data.toString());
        });

    }
}

fs.readFile(appDir + "/.grotesque", (err, data) => {
    if (err) throw "no .grotesque file with array of npm modules provided"
    packages = JSON.parse(data)
    
    console.log(packages)
    packages.forEach(p => {
        let directPath = ""
        let includeParentFolder = false
        if (p.indexOf("..") != -1) {
            includeParentFolder = true
            p = p.replace(/../, "")
        }
        if (p.indexOf("./node_modules/") != -1) {
            directPath = p
        }
        try {
            checkMain(appDir, p, includeParentFolder, directPath)
        } catch(err) {
            console.log(err)
        }
        
    })
    fs.writeFile(appDir + "/.grotescure_cache.json", JSON.stringify(cache))

})