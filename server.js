require('dotenv').config();
const http = require('http');
const express = require('express');
const path = require('path');

const makeDotTemplate = require('./makeDot.js');
const posts = require('./posts.js');
const parseDotTemplate = require('./parseDot.js');

const REPO_PATH = process.env.REPO_PATH;
const TEMPLATE_PATH = path.resolve(REPO_PATH, 'templates/share-embed.html');

const app = express();


app.use('/', express.static(__dirname + '/'));

app.get('/s2R5Mrq/embed', (req, res) => {
    const dotTemplate = makeDotTemplate(TEMPLATE_PATH);
    const context = posts['s2R5Mrq'].context;
    res.send(parseDotTemplate(dotTemplate, context));
});
    
app.listen(4001, function() { console.log('listening')});
