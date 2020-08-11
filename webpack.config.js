const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {BundleAnalyzerPlugin} = require("webpack-bundle-analyzer");

const isDev = process.env.NODE_ENV === "development" ? true : false;
console.log("isDev:", isDev);

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    };
    if (!isDev) {
        config.minimizer = [
            new TerserPlugin(),
            new OptimizeCssAssetsPlugin()
        ];
    }
    return config;
};

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

const cssLoaders = extra => {
    const loaders = [{
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: isDev,
            reloadAll: true
        },
    }, "css-loader"];
    if (extra) {
        loaders.push(extra);
    }
    return loaders;
};

const babepOptions = preset => {
    const opts = {
        presets: [
            "@babel/preset-env"
        ],
        plugins: [
            "@babel/plugin-proposal-class-properties"
        ]
    };
    if (preset) {
        opts.presets.push(preset);
    }
    return opts;
};

const jsLoaders = () => {
    const loaders = [
        {
            loader: "babel-loader",
            options: babepOptions()
        }
    ];
     if (isDev) {
         loaders.push("eslint-loader")
     }
    return loaders;

};

const plugins = () => {
    const base = [
        new HtmlWebpackPlugin({
            template: "./index.html",
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/favicon.ico"),
                    to: path.resolve(__dirname, "dist")
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename("css")
        })
    ];
    if (!isDev) {
        base.push(new BundleAnalyzerPlugin());
    }
    return base;
};

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
        main: ["@babel/polyfill", "./index.jsx"],
        analytics: "./analytics.ts"
    },
    output: {
        filename: filename("js"),
        path: path.resolve(__dirname, "dist")
    },
    resolve: {
        extensions: [".js", ".css", ".less", ".sass", ".scss", ".json", ".png", ".xml", ".csv"],
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@model": path.resolve(__dirname, "src/model")
        }
    },
    optimization: optimization(),
    devServer: {
        port: 4200,
        hot: isDev
    },
    devtool: isDev ? "source-map" : "",
    plugins: plugins(),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders("less-loader")
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders("sass-loader")
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ["file-loader"]
            },
            {
                test: /\.(ttf|woff|woff2|eof2)$/,
                use: ["file-loader"]
            },
            {
                test: /\.xml$/,
                use: ["xml-loader"]
            },
            {
                test: /\.csv$/,
                use: ["csv-loader"]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders()
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: babepOptions("@babel/preset-typescript")
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: {
                    loader: "babel-loader",
                    options: babepOptions("@babel/preset-react")
                }
            }
        ]
    }
};