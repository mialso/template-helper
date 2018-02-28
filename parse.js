const ejs = require('ejs');
const fs = require('fs');

const textData = fs.readFileSync('../res.ejs').toString();

fs.writeFileSync('./res.html', ejs.render(textData, {}));

