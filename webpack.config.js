const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        "DocumentClearance.App": [            
            "./src/SiteAssets/_spa/typeScript/apps/DocClearance/DC.app.ts",
        ],
        "DocumentClearance.Installer": [
            "./src/SiteAssets/_spa/typeScript/apps/DocClearance/DC.db.ts"
        ],
        "PastPerformance.App": [            
            "./src/SiteAssets/_spa/typeScript/apps/PastPerformance/PP.app.ts",
        ],
        "PastPerformance.Installer": [
            "./src/SiteAssets/_spa/typeScript/apps/PastPerformance/PP.db.ts"
        ],
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader', //'ts-loader','babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.hbs?$/,
                use: [{
                    loader: "handlebars-loader",
                    options: {
                        helperDirs: path.resolve(__dirname, "./src/SiteAssets/_spa/handlebars", "helpers"),
                        partialDirs: [
                            path.join(__dirname, "./src/SiteAssets/_spa/handlebars", "partials"),
                            path.join(__dirname, "./src/SiteAssets/_spa/handlebars", "formObjects"),
                            path.join(__dirname, "./src/SiteAssets/_spa/apps/DocClearance", "templates")
                        ]
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.css/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }],
                include: [
                    path.join(__dirname, "./src/SiteAssets/_spa/", "styles")
                ]
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: 'url-loader?limit=10000',
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 65536,
                        },
                    },
                ],
            },
            // ,
            // {
            //   test: /\.(png|svg|jpg|gif)$/,
            //   use: [
            //     'file-loader',
            //   ],
            // }
            /*,
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                use: 'file-loader',
            },

            {
                test: /font-awesome\.config\.js/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'font-awesome-loader' }
                ]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    'file-loader?name=images/[name].[ext]',
                    'image-webpack-loader?bypassOnDebug'
                ]
            },*/
        ],
    },
    devtool: "inline-source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".hbs"],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "src/SiteAssets/_spa/webpack"),
    },
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        // "jquery": "jQuery",
        // "lodash": "lodash"
    }
};