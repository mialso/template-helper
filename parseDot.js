const dot = require('dot');
const fs = require('fs');

//const textData = fs.readFileSync('../res.dot').toString();
const textData = fs.readFileSync('../res.jst').toString();

dot.templateSettings.strip = false;

const postItem = {
    hash: 's2R5Mrq',
    width: 720,
    height: 720,
    ext: '.mp4',
    animated: true,
    title: 'As a Canadian, I can confirm this anarchy is real',
    description: '',
    views: 671385,
    // video options
    looping: '',
    size: '',
};

const context = {
    static_url: '//s.imgur.com/',
    host: 'imgur.com',
    cdn_url: '//i.imgur.com',
    embed_info: {
        referrer: '',
        log_analytics: true,
        context: 'true',
        comment_count: 66,
        account_url: 'booletproove',
    },
    image: postItem,
    item: postItem,
    itemData: function() { return '' },
    Imgur: {
        pluralize: function () { return '' },
        linkify: function () { return '' },
        // useless
        object_to_array: function() { return '' },
    },
    isset: function () { return true },
    notisset: function () { return false },
    //item: function () { return 'item result' },
    not: function (bool) { return !bool },
    is_numeric: function () { return false },
    // video script i consider
    minify: '',
    // useless
    show_poster: function () { return '' },
    making_links: function () { return '' },
};

const tempFn = dot.template(textData);

//console.log(tempFn.toString());

global.Imgur = context.Imgur
global.image = context.image;
global.item = context.item;

fs.writeFileSync('./res.html', tempFn(context));
