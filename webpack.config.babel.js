import webpack from 'webpack';
import path from 'path';
import WebpackNotifierPlugin from 'webpack-notifier';

const production = process.argv.indexOf('-p') !== -1;

const plugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
];

if (!production) {
  plugins.push(
    new WebpackNotifierPlugin({
      excludeWarnings: true,
      alwaysNotify: true,
      sound: true,
      wait: false,
      timeout: 0,
    }),
  );
}

export default {
  devtool: 'sourcemap',
  context: __dirname,
  entry: {
    rverbio: './src/index.js',
  },
  output: {
    filename: '[name].js',
    publicPath: '/assets/',
    path: path.join(__dirname, '/assets/'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        exclude: /(node_modules)/,
        loader: 'eslint-loader',
        options: {
          emitError: true,
          emitWarning: true,
          failOnError: true,
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  devServer: {
    stats: {
      modules: false,
    },
  },
};
