import path from 'path';
import WebpackNotifierPlugin from 'webpack-notifier';

const isUmd = process.argv.indexOf('umd') !== -1;

const plugins = [
];

if (!isUmd) {
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
    publicPath: isUmd ? '/dist/' : '/assets/',
    path: isUmd ? path.join(__dirname, '/dist/') : path.join(__dirname, '/assets/'),
    library: 'rverbio',
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
