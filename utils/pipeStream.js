// wrapper around .pipe() to return a promise and handle events (failure, finish)
function pipeStream(from, to){
    return new Promise((resolve, reject)=>{
        from.on('error', reject);
        to.on('error', reject);
        to.on('finish', resolve);
        from.pipe(to);
    })
}


module.exports = pipeStream