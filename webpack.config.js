const path = require('path');
const package = require("./package.json");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const directory = "TZDEV";

module.exports = {
    entry: './tz_assets/app.js',
    output: {
      filename: '[chunkhash]_bundle.js',
      path: path.resolve(__dirname, '../'+directory+'/public/tz_assets'),
      publicPath: "/tz_assets/"
    },
    plugins: [
        new CleanWebpackPlugin(['tz_assets'],{
            root: path.resolve(__dirname, '../'+directory+'/public')
        }),
        new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            sourceMap: true,
            uglifyJS:{
                output: {
                    comments: false
                },
                compress: {

                }
            }
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require("../"+directory+"/public/lib-manifest.json")
        }),
        new HtmlWebpackPlugin({
            title: '腾正后台',
            template: path.join(__dirname,"tz_assets/template/app.html"),
            filename: path.resolve(__dirname, '../'+directory+'/public/tz_assets/template.html')
        })
    ],
    mode: "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: [
                    path.resolve(__dirname,"node_modules")
                ],
            },
            {
                test: /\.jsx$/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|mp3|svg)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
    devtool: "source-map",
    node: {fs: 'empty'},
    externals: [
        {'./cptable': 'var cptable'},
        {'./jszip': 'jszip'}
     ]
  };
