const path = require('path');
const package = require("./package.json");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: './tz_assets/app.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, '../TZ/public/tz_assets'),
      publicPath: "/tz_assets/"
    },
    plugins: [
        new CleanWebpackPlugin(['tz_assets'],{
            root: path.resolve(__dirname, '../TZ/public')
        })
    ],
    mode: "production",
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
                test: /\.(png|jpg|gif|svg)$/i,
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
                test: /\.(woff|woff2|eot|ttf|otf|mp3)$/,
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
