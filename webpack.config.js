module.exports = {
    entry: "./js/app.js",
    devtool: 'source-map',
    output: {
        path: __dirname + "/",
        filename: "bundle.js"
    },
    devServer: {
        historyApiFallback: true
    },
    resolve: {
  		alias: {
  			'react': 'preact-compat',
  			'react-dom': 'preact-compat',
  		}
    },
    module: {
        loaders: [
            {
                test: /\.js$/, exclude: /node_modules/,
                loader: 'babel-loader',
                query: { "presets": ["es2015-minimal", "react"] }
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            }
        ]
    }
};
