
  
const express = require('express');

const app = express();

app.use(express.static('./dist/genie-frontend-app'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/genie-frontend-app/'}),
);



app.listen(process.env.PORT || 8080);
