const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    // 入口文件配置项
    entry: {
        index:path.resolve(__dirname, 'src/index.js'),
        vendor: ["react",'react-dom']
    },
    // 输出文件配置项
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[contenthash].js',
        chunkFilename: 'js/[name].[contenthash].js',
        publicPath: ""
    },
    // webpack4.x 环境配置项
    mode:"production",
    // 插件配置项
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',//输出文件的名称
            template: path.resolve(__dirname, 'src/index.html'),//模板文件的路径
            title:'webpack-主页',//配置生成页面的标题
            minify:{
		        removeRedundantAttributes:true, // 删除多余的属性
		        collapseWhitespace:true, // 折叠空白区域
		        removeAttributeQuotes: true, // 移除属性的引号
		        removeComments: true, // 移除注释
		        collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
		    },
		    favicon:''
        }),
        new webpack.HashedModuleIdsPlugin(),//实现持久化缓存
        new MiniCssExtractPlugin({
		    filename: 'css/[name].[contenthash].css',
		    chunkFilename: 'css/[name].[contenthash].css',
		}),
		new CleanWebpackPlugin({}),
		new OptimizeCSSAssetsPlugin({})
    ],
    // 加载器 loader 配置项
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader', 
                        options: {
                            importLoaders: 2,
                        }
                    },
                    'postcss-loader',
                    'less-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,        // 小于8kb的图片打包成base 64图片
                            name:'images/[name].[hash:8].[ext]',
                            publicPath:''
                        }
                    }
                ]
            },
            // {
            //     test:/\.html$/,//要处理 `html` 文件中的图片，需要用到 `html-loader`
            //     use:[
            //         {
            //             loader:"html-loader",
            //             options:{
            //                 attrs:["img:src","img:data-src"] 
            //             }
            //         }
            //     ]
            // },
            {
                // 文件依赖配置项——字体图标
                test: /\.(woff|woff2|svg|eot|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'fonts/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {
                // 文件依赖配置项——音频
                test: /\.(wav|mp3|ogg)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'audios/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {
                // 文件依赖配置项——视频
                test: /\.(ogg|mpeg4|webm)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'videos/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {
                rules: [
                    {
                        test: /\.(js|jsx)$/,
                        use: ['babel-loader?cacheDirectory=true'],
                        include: path.resolve(__dirname, 'src'),
                        exclude: /node_modules/,
                    }
                ]
            },
        ]
    },
    // 开发工具
    devtool: 'cheap-module-source-map',
    optimization:{
        splitChunks: {
            chunks: 'all', // 默认
            cacheGroups:{
                    vendors: { 
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    priority: 10,
                    enforce: true,
                },
            }
        },
        // runtimeChunk: {
        //     name: 'manifest'
        // },
    },
    // 模版解析配置项
    resolve: {
        // 设置可省略文件后缀名
        extensions: [' ','.js','.json','.jsx'],
        // 查找 module 的话从这里开始查找;
        modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules")], // 绝对路径;
        // 配置路径映射（别名）
        alias: {
            '@': path.resolve(__dirname, 'src'),
            components: path.resolve(__dirname, 'src/components')
        }
    },
};