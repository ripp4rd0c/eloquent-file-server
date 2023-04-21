const http = require('http');
const methods = require('./methods'); // get all available methods for the server



http.createServer((req, res) => {
    let handler = methods[req.method] || notAllowed;
    
    // method returns a response object
    // call handler
    handler(req).catch((err)=>{
        if(err.status != null) return err;
        return { status: 500, body: String(err)}
    }).then(({status=200, type='text/plain', body})=>{
        // headers
        res.writeHead(status, {
            'content-type': type
        })
        // body
        if(body.pipe && body) body.pipe(res);
        else res.end(body);
    })

}).listen(8000, ()=> console.log("listening on 8000"))

async function notAllowed(req){
    return {
        status: 405,
        body: `method ${req.method} not allowed`
    }
}