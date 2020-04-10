const path = require('path');

module.exports = {
    mode: "development",
    entry: { 
        spa : [
        './src/SiteAssets/_spa/typeScript/handlebars-helper.ts',
        './src/SiteAssets/_spa/typeScript/spa.spEnv.ts',
        './src/SiteAssets/_spa/typeScript/dt-helper.ts',
        './src/SiteAssets/_spa/typeScript/theLoader.ts',
        './src/SiteAssets/_spa/typeScript/spa.spPrompt.ts',
        './src/SiteAssets/_spa/typeScript/spa.spCommon.ts',
        './src/SiteAssets/_spa/typeScript/spa.spQuery.ts',                
        './src/SiteAssets/_spa/typeScript/spa.spCRUD.ts',
        './src/SiteAssets/_spa/typeScript/spa.spAsyncQueue.ts',
        './src/SiteAssets/_spa/typeScript/spa.spDB.ts',
        './src/SiteAssets/_spa/typeScript/apps/DocClearance/DC.app.ts',
    ] },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.hbs?$/,
                use: [{
                    loader: "handlebars-loader",
                    options: {
                        helperDirs: path.resolve(__dirname, "./src/SiteAssets/_spa/handlebars", 'helpers'),
                        partialDirs: [
                            path.join(__dirname, './src/SiteAssets/_spa/handlebars', 'partials')
                        ]
                    }
                  }],
                exclude: /node_modules/
            },
        ],
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.hbs'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'src/SiteAssets/_spa/webpack'),
    },
    externals: {
        // require("jquery") is external and available
        //  on the global var jQuery
        // "jquery": "jQuery",
        // "lodash": "lodash"
      }
};