const webpack = require('webpack');
const path = require('path');

const directory = "TZDEV";

module.exports = {
    output: {
        // 将会生成./ddl/lib.js文件
        path: path.resolve(__dirname, '../'+directory+'/public/ddl'),
        filename: '[name].js',
        library: '[name]',
    },
    entry: {
        "lib": Object.keys(require("./package.json").dependencies),
    },
    plugins: [
        new webpack.DllPlugin({
            // 生成的映射关系文件
            path: path.resolve(__dirname, '../'+directory+'/public/[name]-manifest.json'),
            name: '[name]',
            context: __dirname,
        }),
    ],
    node: {fs: 'empty'}
};
