const path = require("path");

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    devServer: {
        contentBase: "./dist",
        overlay: {
            warnings: true,
            errors: true,
        },
        open: true,
    },
    module: {
        rules: [{
                test: /\.js$/,
                // use: path.resolve("./src/myLoader/my-loader.js"),
                use: [{
                    loader: "my-loader",
                    options: {
                        flag: true,
                    },
                }, ],
            },
            {
                test: /\.md$/,
                use: [{
                    loader: "md-loader",
                }, ],
            },
        ],
    },
    resolveLoader: {
        modules: ["node_modules", "./src/myLoader"],
    },
};