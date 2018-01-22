"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var webpack = require("webpack");
var tsImportPluginFactory = require("ts-import-plugin");
var CleanWebpackPlugin = require("clean-webpack-plugin");
var DEBUG = process.env.NODE_ENV === 'development';
var plugins = [
    /** 提取公共文件 */
    new webpack.optimize.CommonsChunkPlugin({
        names: ['index', 'vendor']
    })
];
if (DEBUG) {
    /** 定义环境变量 */
    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('development')
        }
    }));
}
else {
    /** 编译前清空文件夹 */
    plugins.push(new CleanWebpackPlugin(['static/js'], {
        root: path.join(__dirname, '../'),
        verbose: true,
        dry: false
    }));
    /** 定义环境变量 */
    plugins.push(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production')
        }
    }));
}
exports.default = {
    entry: {
        vendor: ['./src/vendor.tsx'],
        index: ['./src/index.tsx']
    },
    output: {
        filename: DEBUG ? '[name].js' : '[name].[chunkhash:8].js',
        path: path.join(__dirname, '../static/js'),
        publicPath: '/static/js/'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    transpileOnly: true,
                    getCustomTransformers: function () { return ({
                        before: [tsImportPluginFactory()]
                    }); },
                    compilerOptions: {
                        module: 'es2015'
                    }
                }
            },
            {
                test: /\.less/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]
    },
    plugins: plugins
};
