const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chalk = require('chalk');// 改变命令行中输出日志颜色插件
const ip = require('ip').address();//获取本机的局域网 `ip`
const webpack = require("webpack");

module.exports = {
    // 入口文件配置项
    entry: {
        index:path.resolve(__dirname, 'src/index.js'),
        vendor: ["react",'react-dom']
    },
    // 输出文件配置项
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[name].[chunkhash].js',
        publicPath: ""
    },
    // webpack4.x 环境配置项
    mode:"development",
    // 插件配置项
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',//输出文件的名称
            template: path.resolve(__dirname, 'src/index.html'),//模板文件的路径
            title:'webpack-主页',//配置生成页面的标题
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    // 开发服务配置项
    devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,//任意的404响应都被替代为 `index.html`
        host: ip,
        overlay:true,//在浏览页面输出报错信息
        open:true,
        hot:true,
        // progress:true,
        after() {
            console.log(chalk.cyanBright(`http://${ip}:${this.port} 已成功打开`));
        }
    },
    // 加载器 loader 配置项
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [
                    'style-loader', 
                    'css-loader',
                    'postcss-loader',
                ]
            },
            {
                test: /\.less$/,
                use: [
                    'style-loader',
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
    devtool: 'eval-source-map',
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