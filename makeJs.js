const path = require('path');
const fs = require('fs');
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

const SNIPPET_JS_NAME = 'embed-snippet.js';
const CONTROLLER_JS_NAME = 'embed.js';
const IMGUR_COM_PATH = '../imgur_com';
const SNIPPET_JS_PATH = path.resolve(IMGUR_COM_PATH, 'html/include/js/', SNIPPET_JS_NAME); 
const CONTROLLER_JS_PATH = path.resolve(IMGUR_COM_PATH, 'html/include/js/', CONTROLLER_JS_NAME); 
const POLYFILL_JS_PATH = path.resolve(IMGUR_COM_PATH, 'html/include/js/', 'console-polyfill.js'); 

// update snippet js file
const snippetJs = fs.readFileSync(SNIPPET_JS_PATH).toString();

const updatedSnippetJs = snippetJs.replace('s.imgur.com/min/embed-controller.js', `localhost:4001/${CONTROLLER_JS_NAME}`);

fs.writeFileSync(SNIPPET_JS_NAME, updatedSnippetJs);

// update controller file
const controllerJs = fs.readFileSync(CONTROLLER_JS_PATH).toString();
const updatedControllerJs = compose(
    updateOrigin,
    updatePostIdRegexp,
)(controllerJs);
const polyfillJs = fs.readFileSync(POLYFILL_JS_PATH).toString();
fs.writeFileSync(CONTROLLER_JS_NAME, polyfillJs.concat(updatedControllerJs));

function updateOrigin(string) {
    return string.replace('currentOrigin = getScriptOrigin()', 'currentOrigin = "//localhost:4001"');
}

function updatePostIdRegexp(string) {
    return string.split('/.com').join('/4001');//replace('var regex = /.com\/(.+)\/embed/g', 'var regex = /:4001\/(.+)\/embed/g');
}
