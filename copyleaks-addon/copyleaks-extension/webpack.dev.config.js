import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { extensionsRequestBasePath } from '@tridion-docs/extensions-cli';
import { getDevServerConfig } from './devServer.js';

/** @type { import('webpack').Configuration } */
export default (env) => ({
    mode: 'development',
    entry: './src/index.tsx',
    output: {
        library: {
            type: 'system',
        },
        path: resolve(dirname(fileURLToPath(import.meta.url)), '../dist/copyleaks-extension'),
        publicPath: `${extensionsRequestBasePath}/copyleaks-extension/dist/copyleaks-extension`,
        clean: true,
    },
    devServer: getDevServerConfig({
        targetUrl: env.target,
        manifestPath: env.manifest,
        addonConfigPath: env.config,
    }),
    devtool: 'eval-source-map',
    externals: ['react', 'react-dom', 'styled-components', '@tridion-docs/extensions'],
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.css'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{ loader: 'babel-loader' }],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                namedExport: false,
                                localIdentName: '[name]__[local]__[hash:base64]',
                                exportLocalsConvention: 'camelCaseOnly',
                            },
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer(),
                                    cssnano({
                                        safe: true,
                                        autoprefixer: false,
                                    }),
                                ],
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' }),

        new ForkTsCheckerWebpackPlugin({
            typescript: {
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true,
                },
            },
        }),
    ],
});
