var webpack = require('webpack');
var config = require('./package.json');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var autoprefixer = require('autoprefixer');
// var Carefree = require('@nutui/carefree');
var Smock=require('Smock-webpack-plugin');


var webpackConfig = module.exports = {};
var isProduction = process.env.NODE_ENV === 'production';
var isUpload = process.env.NODE_ENV === 'upload';

var curDate = new Date();
var curTime = curDate.getFullYear() + '/' + (curDate.getMonth() + 1) + '/' + curDate.getDate() + ' ' + curDate.getHours() + ':' + curDate.getMinutes() + ':' + curDate.getSeconds();

var bannerTxt = config.name + ' ' + config.version + ' ' + curTime; //构建出的文件顶部banner(注释)内容

webpackConfig.entry = {
    app: './src/app.js',
    vendor: ['vue','axios']
};

webpackConfig.output = {
    path: path.resolve(__dirname, 'build' + '/' + config.version),
    publicPath: config.publicPath + '/'+config.version+'/',
    filename: 'js/[name].js'
};

webpackConfig.module = {
    rules: [{
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ['css-loader?-minimize', 'postcss-loader']
        }),
    }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader?-minimize', 'sass-loader', 'postcss-loader']
        })
    }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            loaders: {
                sass: ExtractTextPlugin.extract({
                    fallback: 'vue-style-loader',
                    use: 'css-loader?-minimize!sass-loader!postcss-loader'
                })
            },
            postcss: [require('autoprefixer')()]
        }
    }, {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
    }, {
        test: /\.(png|jpg|gif|webp)$/,
        loader: 'url-loader',
        options: {
            limit: 3000,
            name: 'img/[name].[ext]',
        }
    }, ]
};

webpackConfig.plugins = [
    new CleanWebpackPlugin('build'),
    new HtmlWebpackPlugin({
        template: './src/index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor'],
    }),
    new ExtractTextPlugin({
        filename: 'css/app.css'
    }),
    new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css\.*(?!.*map)$/g,
        cssProcessorOptions: {
            discardComments: { removeAll: true },
            safe: true,
            autoprefixer: false,
        }
    }),
    new webpack.BannerPlugin(bannerTxt),
    new CopyWebpackPlugin([
        //{ from: path.join(__dirname, "./src/asset/"), to: path.join(__dirname, "./build/asset") }
    ]),
    // new Carefree({
    //     justUseWifi: false,
    //     publicPath: '//page.jd.com/exploit/carefree-test/'+config.version+'/',
    //     // qrcodeUrl:  'http://page.jd.com/exploit/carefree-test/'+config.version+'/index.html',
    //     ftp: {
    //         host: '192.168.181.73',
    //         port: 3000,
    //         source: 'build',
    //         target: '/var/www/html/page.jd.com/exploit/carefree-test/'
    //     }
    //     // ssh: {
    //     //     host: '192.168.182.85',
    //     //     port: '34022',
    //     //     username: 'fe',
    //     //     password: 'fe',
    //     //     source: 'build',
    //     //     target: '/home/fe/carefree-test/'
    //     // }
    // })
    new Smock({
        host:'111.206.228.111',
        domain:'kudou-staff-m-fy.jd.com',
        projectName:'test'
    })
];

if (isProduction || isUpload) {
    webpackConfig.devtool = '#cheap-module-source-map';
    webpackConfig.plugins = (webpackConfig.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                ecma: 8,
                warnings: false
            }
        })
    ]);
} else if (process.env.NODE_ENV === 'carefree'){
    webpackConfig.devtool = false;
}else{
    webpackConfig.output.publicPath = '/';
    webpackConfig.devtool = '#cheap-module-eval-source-map';
    webpackConfig.devServer = {
        contentBase: path.resolve(__dirname, 'build'),
        compress: true, //gzip压缩
        historyApiFallback: true,
    };
}