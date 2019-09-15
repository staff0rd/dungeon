const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },{
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }

    ]
  },
  optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          filename: '[name].bundle.js',
					chunks: 'all'
				}
			}
		}
	},
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    function() {
        this.plugin('watch-run', function(watching, callback) {
            console.log('Begin compile at ' + new Date());
            callback();
        })
    }
  ],
  performance: {
    maxEntrypointSize: Number.MAX_SAFE_INTEGER,
    maxAssetSize: Number.MAX_SAFE_INTEGER,
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 5000
  }
};