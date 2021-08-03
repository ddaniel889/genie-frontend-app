
  
const express = require('express');

const app = express();

app.use(express.static('./dist/genie'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/genie/'}),
);



app.listen(process.env.PORT || 8080);