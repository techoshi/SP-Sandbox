const path = require('path');

module.exports = {
    mode: "development",
    entry: { 
        spa : [
        './src/SiteAssets/_spa/scripts/handlebars-helper.js',
        './src/SiteAssets/_spa/scripts/jquery.spEnv.js',
        './src/SiteAssets/_spa/scripts/dt-helper.js',
        './src/SiteAssets/_spa/scripts/theLoader.js',
        './src/SiteAssets/_spa/scripts/jquery.spPrompt.js',
        './src/SiteAssets/_spa/scripts/jquery.spCommon.js',
        './src/SiteAssets/_spa/scripts/jquery.spQuery.js',
        
        
        './src/SiteAssets/_spa/scripts/jquery.spCRUD.js',

        './src/SiteAssets/_spa/scripts/jquery.spAsyncQueue.js',
        './src/SiteAssets/_spa/scripts/jquery.spDB.js',
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
                use: 'handlebars-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};