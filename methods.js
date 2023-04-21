const fs = require('fs');
const urlPath = require('./utils/urlPath');
const mime = require('mime');
const pipeStream = require('./utils/pipeStream');

const methods = Object.create(null);

// GET: returns list of files if reading dir, else file contents
methods.GET = async (req) => {
    const path = urlPath(req.url);
    console.log("fetching ", path);
    let stats;
    try{
        stats = await fs.promises.stat(path);
    }catch(err){
        if(err.code != "ENOENT") throw err;
        return {
            status: 404,
            body: "FILE NOT FOUND"
        }
    }

    if (stats.isDirectory()){
        return{
            body: (await fs.promises.readdir(path)).join("\n")
        }
    }
    else{
        return{
            body: fs.createReadStream(path),
            type: mime.getType(path)
        }
    }
};

methods.DELETE = async (req) => {
    const path = urlPath(req.url);
    let stats;

    try{
        stats = await fs.promises.stat(path);
    }catch(err){
        if(err.code!="ENOENT") throw err;
        else return{
            status: 204
        }
    }

    if(stats.isDirectory()) await fs.promises.rmdir(path);
    else await fs.promises.unlink(path);

    return {
        status: 204
    }
}

methods.PUT = async (req) => {
    const path = urlPath(req.url);
    await pipeStream(req, fs.createWriteStream(path))
    return {
        status: 204 
    }
}



module.exports = methods;