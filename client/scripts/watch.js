const path = require('path');
const fs = require('fs-extra');
const buildConfig = require('./webpack.buildConfig');
const webpack = require('webpack');



const config = buildConfig();
console.log('Buiding with the following config:');
console.log(config);

const compiler = webpack(config);

try {
    (async function () {
        // await compiler.run();
        compiler.watch({}, function (err) {
            console.log('compiling finished');
            if (!!err) console.log(err);
        });
    })();
} catch (e) {
    console.log(e);
}
