const fs = require('fs');

const myTemp = fs.readFileSync('./imgur_com/templates/share-embed.html').toString();

const stringItems = [];
const templateItems = [];

const toReplace = {
    "item.hash": '111111',
    "minify": "minify",
};

const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

const substituteParts = [];
//const ifElse = [];

let counter = 0;
let lastSplitter = 0;
while (counter < myTemp.length) {
    //const symbol = myTemp[counter];
    if (hasMatch('{$', counter, myTemp)) {
        // push part
        //console.log('new replace found');
        //console.log('new part found: %s:%s', lastSplitter, counter);
        stringItems.push(myTemp.slice(lastSplitter, counter));

        const injection = getTextUntil('}', myTemp, counter + 2);
        console.log('new injection found: %s to %s', injection, updateToJs(injection));
        //substituteParts.push(toReplace[injection] || "000000000");


        //templateItems.push(injection);
        stringItems.push(getInjection(injection));
        counter = counter + injection.length + 3;
        lastSplitter = counter;
    } else if (hasMatch('{*', counter, myTemp)) {
        stringItems.push(myTemp.slice(lastSplitter, counter));
        const injection = getTextUntil('}', myTemp, counter + 2);
        console.log('new comment found: %s', injection);
        //stringItems.push(getJsIf(injection));
        counter = counter + injection.length + 3;
        lastSplitter = counter;
    } else if (hasMatch('{if', counter, myTemp)) {
        stringItems.push(myTemp.slice(lastSplitter, counter));
        const injection = getTextUntil('}', myTemp, counter + 3);
        console.log('new if found: %s to %s', injection, updateToJs(injection));
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
        console.log('new minify found: %s to %s', injection, toReplace['minify']);
        stringItems.push(getInjection(toReplace['minify']));
        counter = counter + injection.length + 2;
        lastSplitter = counter;
    } else if (hasMatch('{Imgur', counter, myTemp)) {
        stringItems.push(myTemp.slice(lastSplitter, counter));
        const injection = getTextUntil('}', myTemp, counter + 1);
        console.log('new Imgur found: %s to %s', injection, updateToJs(injection));
        //console.log('new minify found: %s to %s', injection, toReplace['minify']);
        stringItems.push(getInjection(injection));
        counter = counter + injection.length + 2;
        lastSplitter = counter;
    } else if (hasMatch('{include', counter, myTemp)) {
        stringItems.push(myTemp.slice(lastSplitter, counter));
        const injection = getTextUntil('}', myTemp, counter + 1);
        console.log('new include found: %s', injection);
        //stringItems.push(getInjection(updateToJs(injection, replaceDoubleCol)));
        counter = counter + injection.length + 2;
        lastSplitter = counter;
    } else {
        counter += 1;
    }
}

stringItems.push(myTemp.slice(lastSplitter));

const resOutput = compose(
    //removeGlobalImage,
    //removeGlobalItem,
    removeItemAsFunc,
)(stringItems.join(''));



fs.writeFileSync('./res.jst', resOutput);

function removeItemAsFunc(string) {
    return string.split('item(').join('itemData(');
}

function removeGlobalItem(string) {
    return ['(', '!', ' ', '/'].reduce((acc, str) => acc.split(`${str}item.`).join(`${str}it.item.`), string)
    //return string.split('(item.').join('(it.item.');
}

function removeGlobalImage(string) {
    return ['(', '!', ' ', '/'].reduce((acc, str) => acc.split(`${str}image.`).join(`${str}it.image.`), string)
}

/*
function removeGlobalItemTwo(string) {
    return string.split(' item.').join(' it.item.');
}

function removeGlobalImageOne(string) {
    return string.split('(image.').join('(it.image.');
}

function removeGlobalImageTwo(string) {
    return string.split(' image.').join(' it.image.');
}
*/

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
