const express = require('express');

const app = express();

app.use(express.static(__dirname.join('/plubic')));

app.listen(8080, function listen() {
    console.log('Starting server on port 8080.');
});
