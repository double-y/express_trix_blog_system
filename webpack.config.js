var path = require('path');
module.exports = {
    entry: './es6/main.js',
    output: {
        path: './public/javascripts',
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { test: path.join(__dirname, 'es6'),
              loader: 'babel-loader' }
        ]
    }
};