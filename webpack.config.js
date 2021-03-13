const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin'); .// if there is a moment ds in the project, then uncomment this line
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ProgressPlugin = require('progress-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

const pkg = require('./package.json');

const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
const ROOT_DIR = path.resolve(__dirname);
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'public');
const NODE_MODULES_DIR = path.join(ROOT_DIR, 'node_modules');
const ENTRY = path.join(SRC_DIR, 'index.js');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8000;

const config = {
  context: SRC_DIR,
  entry: ENTRY,

  output: {
    filename: '[name].[hash:8].js',
    path: DIST_DIR,
    publicPath: PUBLIC_PATH,
    assetModuleFilename: 'images/[name][ext][query]',
  },

  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: NODE_MODULES_DIR,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
          'postcss-loader',
        ],
        include: /\.module\.css$/,
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },

      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              encoding: false,
            },
          },
        ],
      },

      {
        test: /\.(png|jpg|gif|webp|avif)$/i,
        type: 'asset/resource',
      },
    ],
  },

  resolve: {
    modules: [SRC_DIR, NODE_MODULES_DIR],
    extensions: ['.jsx', '.js', '.json'],
  },

  performance: {
    hints: false,
  },

  stats: {
    colors: true,
  },

  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      favicon: './favicon.ico',
      title: pkg.title,
      template: 'index.html',
    }),

    new CopyPlugin({
      patterns: [{ from: 'static', to: 'static', force: true }],
    }),

    new Dotenv({
      safe: true,
    }),

    // new MomentLocalesPlugin(),

    new ProgressPlugin(true),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
};

module.exports = (env, argv) => {
  const isDevelopment = argv.mode !== 'production';

  if (isDevelopment) {
    config.devtool = 'eval-cheap-module-source-map';
    config.mode = 'development';
    config.optimization = {
      minimize: false,
      moduleIds: 'named',
    };

    config.target = 'web';

    config.devServer = {
      host,
      port,
      contentBase: DIST_DIR,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
      historyApiFallback: true,
      hot: true,
      inline: true,
      noInfo: false,
      overlay: {
        warnings: true,
        errors: true,
      },
      watchOptions: {
        ignored: NODE_MODULES_DIR,
        aggregateTimeout: 1500,
        poll: 1500,
      },
      publicPath: PUBLIC_PATH,
    };

    config.plugins.push(
      new FriendlyErrorsWebpackPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new MiniCssExtractPlugin({ filename: '[name].css' })
    );
  }

  if (!isDevelopment) {
    config.target = 'browserslist';
    config.devtool = false; // *"source-map";
    config.optimization = {
      minimize: true,
      minimizer: [
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),

        '...',
      ],
      splitChunks: {
        chunks: 'async',
        minSize: 70000,
        minRemainingSize: 0,
        maxSize: 300000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'initial',
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: -20,
            chunks: 'initial',
            reuseExistingChunk: true,
          },
        },
      },
    };

    config.plugins.push(
      new MiniCssExtractPlugin({ filename: '[name].[hash:8].css' }),
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg)$/,
        compressionOptions: {
          params: {
            [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
          },
        },
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false,
      })
    );
  }

  return config;
};
