/**
 * Created by Veket on 2017/9/19.
 */
const env = process.env.NODE_ENV;  //环境变量
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');//生成一个HTML文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const buildPath = path.resolve(__dirname,'dist');
const nodeModulesPath = path.resolve(__dirname,'node_modules');
const srcDir = path.resolve(process.cwd(),'src');
const libDir = path.resolve(srcDir, 'js/lib');
const glob = require('glob');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**考虑多页面应用，多个入口文件**/
const _entries = {};
const fileNames=[];
const jsDir = path.resolve(srcDir,'js/entry');
const entryFiles = glob.sync(`${jsDir}/*.js`);
entryFiles.forEach((filePath) => {
    const filename = filePath.substring(filePath.lastIndexOf('/')+1,filePath.lastIndexOf('.'));
_entries[filename] = filePath;
fileNames.push(filename);
});

module.exports = (() => {

    const htmlPlugins = () => {
        const entryHtml = glob.sync(`${srcDir}/html/*.html`);
        const rtn = [];
        entryHtml.forEach((filePath) => {
            const filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
            const cfg = {
                template:`${filePath}`,
                filename:`${filename}.html`,
                favicon:`${srcDir}/img/favicon.ico`,
                chunksSortMode:'dependency'
            };
            if(filename in _entries){
                cfg.inject = 'body';
                cfg.chunks = ['vendor','common',filename];
            }
            rtn.push(new HtmlWebpackPlugin(cfg));
        });
        return rtn;
    };

    const config={
        resolve:{
            extensions:['.js', '.vue','.css', '.png', '.jpg'],
            alias:{
                vue$:`${nodeModulesPath}/vue/dist/vue.js`,
                img:`${srcDir}/img`,
                fonts:`${srcDir}/fonts`,
                apputil:`${srcDir}/js/util/main.js`,
                "@":`${srcDir}/js`
            }
        },
        entry:Object.assign(_entries, { vendor: ['vue','vue-router','element-ui'] }),
        output:{
            path:buildPath,
            publicPath:'',
            filename:'[name].js',
            chunkFilename:'[id].js'
        },
        devServer:{
            hot:true,
            inline:true,
            publicPath:'',
            port:5000,
            host:'localhost',
            stats:{cached:false,colors:true}
        },
        devtool: '#eval-source-map',
        plugins:[
            new webpack.HotModuleReplacementPlugin(),
            new webpack.optimize.ModuleConcatenationPlugin(),
            new webpack.DefinePlugin({
                __DEV__: env === 'development',
                __PROD__: env === 'production'
            }),
            new CommonsChunkPlugin({
                names: ['common', 'vendor'],
                minChunks: 2,
            }),
            new ExtractTextPlugin({
                filename: 'css/[name].css',
                allChunks: true
            }),
            new webpack.ProvidePlugin({'_': "underscore",'Vue':'vue','AppUtil':'apputil',}),
            /*new BundleAnalyzerPlugin({ openAnalyzer: false }),*/
            new OpenBrowserPlugin({url:'http://localhost:5000/main.html'})
        ].concat(htmlPlugins()),
        module:{
            rules:[
                /*{
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    enforce: 'pre',
                    include: [srcDir],
                    options: {
                        formatter: require('eslint-friendly-formatter')
                    }
                },*/
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options:{
                        loaders:{
                            css:['css-hot-loader'].concat(ExtractTextPlugin.extract({
                                use:'css-loader',
                                fallback:'vue-style-loader',
                                publicPath: '../'
                            })),
                            less:['css-hot-loader'].concat(ExtractTextPlugin.extract({
                                use:['css-loader','postcss-loader','less-loader'],
                                fallback:'vue-style-loader',
                                publicPath: '../'
                            })),
                            postcss:['css-hot-loader'].concat(ExtractTextPlugin.extract({
                                use:['css-loader','postcss-loader'],
                                fallback:'vue-style-loader',
                                publicPath: '../'
                            })),
                        }
                    }
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: [nodeModulesPath],
                },
                {
                    test: /\.css$/,
                    use:['css-hot-loader'].concat(ExtractTextPlugin.extract({
                        use:['css-loader','postcss-loader'],
                        fallback:'style-loader',
                        publicPath: '../'
                    }))
                },
                /*{
                    test: /\.(scss|sass)$/,
                    use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                        use: ['css-loader', 'postcss-loader', 'sass-loader'],
                        fallback: 'style-loader',
                        publicPath: '../'
                    }))
                },*/
                {
                    test: /\.(less)$/,
                    use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                        use: ['css-loader', 'postcss-loader', 'less-loader'],
                        fallback: 'style-loader',
                        publicPath: '../'
                    }))
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-sprite-loader',
                    include: [path.resolve(__dirname,'src/js/icons')],
                    options: {
                        symbolId: 'icon-[name]'
                    }
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg)(\?.*)?$/,
                    exclude: [path.resolve(__dirname,'src/js/icons')],
                    use:[{
                        loader:'url-loader',
                        options:{
                            limit:10000,
                            name:'img/[name].[ext]'
                        }
                    }]
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    use:[{
                        loader:'url-loader',
                        options:{
                            limit:10000,
                            name:'fonts/[name].[ext]'
                        }
                    }]
                },
            ]
        },
    };

    return config;

})();