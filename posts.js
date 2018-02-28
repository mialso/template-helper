require('dotenv').config();
const path = require('path');
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
    static_url: process.env.CONTEXT_STATIC_URL,
    host: process.env.CONTEXT_HOST,
    cdn_url: process.env.CONTEXT_CDN_URL,
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

module.exports = {
    's2R5Mrq': { post: postItem, context: context },
};
