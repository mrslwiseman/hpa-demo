const http = require('http');

const PORT = process.env.PORT || 8080;

const slowFunction = () => {
    for(let i = 0; i<=100; i++){
        array = new Array(1e6).fill(null).map(() => Math.random());
    }
}

const server = http.createServer((_request, response) => {
    const then = Date.now();

    slowFunction();

    response.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    response.write(`Hello, World!, This request took: ${Date.now()-then}ms`);

    response.end();

});

server.listen(PORT);

console.log('Server running on port', PORT);

process.on('SIGINT', () => {
    console.log('shutting down...')
    process.exit(1)
})