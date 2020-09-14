const path = require('path');
module.exports = {
  module: {
    rules: [{
      test: /\.(css|less)$/,
      exclude: [/node_modules/],
      use: [{
        loader: "style-loader"
      },
      {
        loader: "css-loader",
        options: {
          modules: {
            mode: 'local',
            localIdentName: '[path][name]__[local]--[hash:base64:5]',
            context: path.resolve(__dirname, 'src'),
            hashPrefix: 'my-custom-hash',
          },
        }
      },
      {
        loader: "less-loader",
        options: {
          modifyVars: {
            'primary-color': "#0066ff",
            "layout-header-height": "50px",
            'menu-collapsed-width': '50px',
            '@font-size-base': '15px'
          },
          javascriptEnabled: true
        }
      }
      ]
    },
    {
      test: /\.(css|less)$/,
      exclude: [/src/],
      use: [{
        loader: "style-loader"
      },
      {
        loader: "css-loader",
      },
      {
        loader: "less-loader",
        options: {
          javascriptEnabled: true
        }
      }
      ]
    },
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env'], "@babel/preset-react"
          ],
          exclude: '**/node_modules/**',
          plugins: [
            '@babel/plugin-proposal-object-rest-spread',
            "@babel/plugin-proposal-class-properties", ["@babel/plugin-proposal-decorators", {
              "decoratorsBeforeExport": true
            }],
            "@babel/plugin-transform-react-jsx",
          ]
        }
      }
    },
    {
      test: /\.(bmp|gif|png|jpe?g)$/,

      use: {
        loader: require.resolve('url-loader'),
        options: {
          limit: 8192,
          name: '[name].[hash:6].[ext]'
        }
      }
    }
    ]

  },
};