const fs = require('fs');
const urlPath = require('./utils/urlPath');

const methods = Object.create(null);

// GET: returns list of files if reading dir, else file contents
methods.GET = async (req) => {
    const path = urlPath(req.path);
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
            body: (await fs.readdir(path)).join("\n")
        }
    }
    else{
        return{
            body: fs.createReadStream(path),
            type: mime.getType(path)
        }
    }
};





module.exports = methods;