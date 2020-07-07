const webpack = require ("webpack");
var path = require('path');
// const UglifyJsPlugin=require('uglifyjs-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');
var config = {
    // devtool: 'inline-source-map',
    mode: 'development',
    entry: {

        robot_app: './src/index.js'

    },

    output: {

        path: path.join(__dirname, './dist'),

        // publicPath: '/dist/',

        filename: '[name].bundle.js'

    },
    
    // devServer: {
    //     contentBase: "./dist",//本地服务器所加载的页面所在的目录
    //     historyApiFallback: true,//不跳转
    //     inline: true//实时刷新
    //   } 
    devServer:{                                     //配置
        contentBase: "./dist", 
        // https:true,
        // host: '10.19.126.200',
        // historyApiFallback:true,
        inline:true,

        // progress:true,
        hot:true,
        // port:8080
    },
    // optimization: {
    //     minimizer: [
    //         new UglifyJsPlugin({
    //             uglifyOptions: {
    //                 compress: true
    //             }
    //         })
    //     ]
    // },
    // optimization: {
    //     minimizer: [
    //       new TerserPlugin({
    //         cache: true,
    //         parallel: true,
    //         sourceMap: true, // Must be set to true if using source-maps in production
    //         terserOptions: {
    //           // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
    //         }
    //       }),
    //     ],
    //   },
    plugins:[
        new webpack.NamedModulesPlugin(),
         new webpack.HotModuleReplacementPlugin(),                     //引用这个插件实现热更新
     ]
  
  

}

module.exports = config;