const dot = require('dot');
//const fs = require('fs');

//const textData = fs.readFileSync('../res.dot').toString();
//const textData = fs.readFileSync('../res.jst').toString();

dot.templateSettings.strip = false;

//const tempFn = dot.template(textData);

//console.log(tempFn.toString());

//fs.writeFileSync('./res.html', tempFn(context));
//
module.exports = function(templateString, context) {
    const template = dot.template(templateString);

    global.Imgur = context.Imgur
    global.image = context.image;
    global.item = context.item;

    return template(context);
}
