const path = require('path');
const url = require('url');

const baseDir = process.cwd();
console.log(baseDir);

function getPath(urlPath){
    const pathName = url.parse(urlPath).pathname;
    const finalPath = path.resolve(decodeURIComponent(pathName).slice(1));

    if(finalPath != baseDir+path.sep && !finalPath.startsWith(baseDir)){
        return {
            status: 403,
            body: "forbidden"
        }
    }
    return finalPath

}

// console.log(getPath('http://localhost:8000/bla/utils/plain/text'));

module.exports = getPath;