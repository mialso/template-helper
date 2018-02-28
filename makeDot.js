const fs = require('fs');

const toReplace = {
    "minify": "minify",
};

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

//fs.writeFileSync('./res.jst', makeDotStringTemplate(TEMPLATE_PATH));

module.exports = makeDotStringTemplate;

function makeDotStringTemplate(templatePath) {
    const myTemp = fs.readFileSync(templatePath).toString();
    const stringItems = [];
    const substituteParts = [];

    let counter = 0;
    let lastSplitter = 0;
    while (counter < myTemp.length) {
        if (hasMatch('{$', counter, myTemp)) {
            // push part
            stringItems.push(myTemp.slice(lastSplitter, counter));
            const injection = getTextUntil('}', myTemp, counter + 2);
            //console.log('new injection found: %s to %s', injection, updateToJs(injection));
            stringItems.push(getInjection(injection));
            counter = counter + injection.length + 3;
            lastSplitter = counter;
        } else if (hasMatch('{*', counter, myTemp)) {
            stringItems.push(myTemp.slice(lastSplitter, counter));
            const injection = getTextUntil('}', myTemp, counter + 2);
            //console.log('new comment found: %s', injection);
            //stringItems.push(getJsIf(injection));
            counter = counter + injection.length + 3;
            lastSplitter = counter;
        } else if (hasMatch('{if', counter, myTemp)) {
            stringItems.push(myTemp.slice(lastSplitter, counter));
            const injection = getTextUntil('}', myTemp, counter + 3);
            //console.log('new if found: %s to %s', injection, updateToJs(injection));
            stringItems.push(getJsIf(injection));
            counter = counter + injection.length + 4;
            lastSplitter = counter;
        } else if (hasMatch('{/if}', counter, myTemp)) {
            stringItems.push(myTemp.slice(lastSplitter, counter));
            stringItems.push('{{?}}');
            counter = counter + 5;
            lastSplitter = counter;
        } else if (hasMatch('{else}', counter, myTemp)) {
            stringItems.push(myTemp.slice(lastSplitter, counter));
            stringItems.push('{{??}}');
            counter = counter + 6;
            lastSplitter = counter;
        } else if (hasMatch('{minify', counter, myTemp)) {
            stringItems.push(myTemp.slice(lastSplitter, counter));
            const injection = getTextUntil('}', myTemp, counter + 1);
            //console.log('new minify found: %s to %s', injection, updateToJs(injection, replaceDol));
            //console.log('new minify found: %s to %s', injection, toReplace['minify']);
            stringItems.push(getInjection(toReplace['minify']));
            counter = counter + injection.length + 2;
            lastSplitter = counter;
        } else if (hasMatch('{Imgur', counter, myTemp)) {
            stringItems.push(myTemp.slice(lastSplitter, counter));
            const injection = getTextUntil('}', myTemp, counter + 1);
            //console.log('new Imgur found: %s to %s', injection, updateToJs(injection));
            stringItems.push(getInjection(injection));
            counter = counter + injection.length + 2;
            lastSplitter = counter;
        } else if (hasMatch('{include', counter, myTemp)) {
            stringItems.push(myTemp.slice(lastSplitter, counter));
            const injection = getTextUntil('}', myTemp, counter + 1);
            //console.log('new include found: %s', injection);
            //stringItems.push(getInjection(updateToJs(injection, replaceDoubleCol)));
            counter = counter + injection.length + 2;
            lastSplitter = counter;
        } else {
            counter += 1;
        }
    }

    stringItems.push(myTemp.slice(lastSplitter));
    return compose(
        //removeGlobalImage,
        //removeGlobalItem,
        removeItemAsFunc,
        //removeImproperComparison,
    )(stringItems.join(''));
}


function removeItemAsFunc(string) {
    return string.split('item(').join('itemData(');
}

/*
function removeImproperComparison(string) {
    return string.split(' != ').join(' !== ');
}
*/

function removeGlobalItem(string) {
    return ['(', '!', ' ', '/'].reduce((acc, str) => acc.split(`${str}item.`).join(`${str}it.item.`), string)
}

function removeGlobalImage(string) {
    return ['(', '!', ' ', '/'].reduce((acc, str) => acc.split(`${str}image.`).join(`${str}it.image.`), string)
}

function getInjection(injection) {
    return `{{=${updateToJs(injection)}}}`
}

function getJsIf(injection) {
    return `{{? ${updateToJs(injection)}}}`
}

function updateToJs(string, enchancer = removeDol) {
    return compose(
        replaceExclamation,
        prependIt,
        replaceEqual,
        replaceDoubleCol,
        replaceArrow,
    )(enchancer(string.trim()));
}

function prependIt(string) {
    return 'it.'.concat(string);
}

function replaceExclamation(string) {
    return string.split('.!').join('.not');
}
function replaceArrow(string) {
    return string.split('->').join('.');
}

function removeDol(string) {
    return string.split('$').join('');
}

function replaceDol(string) {
    return string.split('$').join('.');
}

function replaceDoubleCol(string) {
    return string.split('::').join('.');
}

function replaceEqual(string) {
    const isEqual = string.split('=').length === 2;
    if (!isEqual) return string;
    return string.split('=').join('(').concat(')');
}

function getTextUntil(match, text, startIndex) {
    let buffer = '';
    let counter = startIndex;
    while (!hasMatch(match, counter, text)) {
        buffer = buffer.concat(text[counter]);
        counter += 1;
    }
    return buffer;
}

function hasMatch(str, counter, text) {
    if (typeof str === 'string') {
        return text.slice(counter, counter + str.length) === str;
    }
    return str.reduce((acc, string) => acc || hasMatch(string, counter, text), false)
}
