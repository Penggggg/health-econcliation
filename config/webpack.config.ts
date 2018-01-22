import * as path from 'path';
import * as webpack from 'webpack';
import * as tsImportPluginFactory from 'ts-import-plugin';
import * as CleanWebpackPlugin from 'clean-webpack-plugin';

const DEBUG = process.env.NODE_ENV === 'development';

const plugins = [
  /** 提取公共文件 */
  new webpack.optimize.CommonsChunkPlugin({
    names: [ 'index', 'vendor' ]
  })
];

if ( DEBUG ) { 

  /** 定义环境变量 */
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  );
} else {

    /** 编译前清空文件夹 */
  plugins.push(new CleanWebpackPlugin(['static/js'], {
    root: path.join(__dirname, '../'),
    verbose: true,
    dry: false
  }));

  /** 定义环境变量 */
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  );
}


export default {
  entry: {
    vendor: ['./src/vendor.tsx'],
    index: ['./src/index.tsx']
  },
  output: {
    filename: DEBUG ? '[name].js' : '[name].[chunkhash:8].js',
    path: path.join(__dirname, '../static/js'),
    publicPath: '/static/js/'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [ tsImportPluginFactory( ) ]
          }),
          compilerOptions: {
            module: 'es2015'
          }
        }
      },
      {
         test: /\.less/,
         use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  plugins
};

