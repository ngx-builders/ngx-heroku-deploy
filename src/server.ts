const express = require('express');

const app = express();

app.use(express.static('./app'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'app/'}),
);

app.listen(process.env.PORT || 8080);