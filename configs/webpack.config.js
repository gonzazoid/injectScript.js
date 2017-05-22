var webpack = require('webpack');

var baseConfig = {
    context: __dirname,
    entry: {
        test: [
            "../lib/test.ts",
        ]
    },
    output: {
        path: __dirname + '/../build/',
        pathinfo: true,
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.js', '.json', '.html'],
        modules: ['node_modules']
    },
    plugins: [
    ],
    module: {
        rules:[
            {enforce: 'pre', test: /\.ts$/, loader: "tslint-loader", options: {configFile: './configs/tslint.json'}}
           ,{test: /\.ts$/, exclude: /node_modules/, loader: 'ts-loader?' + JSON.stringify({configFileName: './configs/tsconfig.json'})},
        ]
    }
};

module.exports = baseConfig;
