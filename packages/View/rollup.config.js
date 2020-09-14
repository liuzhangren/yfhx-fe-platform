// import buble from 'rollup-plugin-buble';
// import babel from 'rollup-plugin-babel';
// import nodeResolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
// import nodeGlobals from 'rollup-plugin-node-globals';
// import postcss from 'rollup-plugin-postcss';

// const babelOptions = {
//   "presets": [
//     ["@babel/preset-env", {"modules": false}],
//     ["@babel/preset-react"],
//   ],
//   "exclude": '**/node_modules/**',
//   "runtimeHelpers": true,
//   "babelrc": false,
//   "plugins": [
//     "@babel/plugin-proposal-object-rest-spread",
//     "@babel/plugin-transform-react-jsx",
//     "@babel/plugin-transform-runtime",
//     "@babel/plugin-proposal-class-properties"
//   ],
// }

// export default {
//   input: './index.js',
//   external: [
//     'react',
//     'react-dom',
//     'prop-types',
//     'antd',
//     'add-dom-event-listener',
//     'css-animation',
//     'classnames'
//   ],
//   output: {
//     file: 'dist/index.js',
//     format: 'es',
//     name: 'bundle',
//     sourcemap: false
//   },
//   plugins: [
//     postcss({
//       extensions: ['.css', '.scss', '.less'],
//       use : [
//         'sass', 
//         ['less', { javascriptEnabled: true }]
//       ],
//     }),
//     nodeResolve({ browser: true}),
//     nodeGlobals(),
//     babel(babelOptions),
//     commonjs()
//   ]
// }

import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import json from 'rollup-plugin-json';
import simplevars from 'postcss-simple-vars';
import nested from 'postcss-nested';
import cssnext from 'postcss-cssnext';
import cssnano from 'cssnano';
import NpmImport from 'less-plugin-npm-import';


export default {
  input: './index.js',
  external: ['react', 'antd', 'react-dom', 'prop-types'],
  output: {
    file: 'dist/index.js',
    format: 'es',
    name: 'bundle',
    sourcemap: false
  },
  plugins: [
    json(),
    postcss({
      modules: {
        plugins: [
          require("postcss-modules")({
            scopeBehaviour: "global" // can be 'global' or 'local',
          })
        ]
      },
      extensions: ['.less'],
      use: [
        ['less', {
          plugins: [new NpmImport({ prefix: '~' })],
          modifyVars: {
            'primary-color': "#0066ff",
            "layout-header-height": "50px",
            'menu-collapsed-width': '50px',
            'font-size-base': '15px'
          },
          javascriptEnabled: true
        }]
      ],
      plugins: [
        simplevars(),
        nested(),
        cssnext({ warnForDuplicates: false, }),
        cssnano()
      ]
    }),
    nodeResolve({ browser: true }),
    commonjs({ include: /node_modules/ }),
    babel({
      "presets": [
        ["@babel/preset-env", { "modules": false }],
        ["@babel/preset-react"],
      ],
      "exclude": '**/node_modules/**',
      "runtimeHelpers": true,
      "babelrc": false,
      plugins: [
        "@babel/plugin-proposal-object-rest-spread",
        "@babel/plugin-transform-react-jsx",
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-decorators", { "decoratorsBeforeExport": true }],
        "@babel/plugin-proposal-class-properties",
      ]
    }),

  ]
}