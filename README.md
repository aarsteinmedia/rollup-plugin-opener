# Serve rollup bundle and open in browser

This is a fork of [rollup-plugin-serve](https://github.com/thgh/rollup-plugin-serve), made to address issues with typescript + option to choose which browser to open page in.

## Installation

```
npm install --save-dev rollup-plugin-opener

pnpm add -D rollup-plugin-opener
```

## Usage

```js
// rollup.config.js
import opener from 'rollup-plugin-opener'

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: ...
  },
  plugins: [
    serve('dist')
  ]
}
```

### Options

By default it serves the current project folder. Change it by passing a string:

```js
serve('public')    // will be used as contentBase

// Default options
serve({

   /**
   * Choose which browser to open in.
   * Will not do anything if `open = false`.
   * Will use system default browser if not set.
   */
  browser: 'firefox',

  // Launch in browser (default: false)
  open: true,

  // Page to navigate to when opening the browser.
  // Will not do anything if open=false.
  // Remember to start with a slash.
  openPage: '/different/page',

  // Choose which browser to open in.
  // Will not do anything if open=false.
  // System default if not set.
  browser: 'firefox',

  // Show server address in console (default: true)
  verbose: false,

  // Folder to serve files from
  contentBase: '',

  // Multiple folders to serve from
  contentBase: ['dist', 'static'],

  // Set to true to return index.html (200) instead of error page (404)
  historyApiFallback: false,

  // Path to fallback page
  historyApiFallback: '/200.html',

  // Options used in setting up server
  host: 'localhost',
  port: 10001,

  // By default server will be served over HTTP (https: false). It can optionally be served over HTTPS
  https: {
    key: fs.readFileSync('/path/to/server.key'),
    cert: fs.readFileSync('/path/to/server.crt'),
    ca: fs.readFileSync('/path/to/ca.pem')
  },

  //set headers
  headers: {
    'Access-Control-Allow-Origin': '*',
    foo: 'bar'
  },

  // set custom mime types, usage https://github.com/broofa/mime#mimedefinetypemap-force--false
  mimeTypes: {
    'application/javascript': ['js_commonjs-proxy']
  }

  // execute function after server has begun listening
  onListening: function (server) {
    const address = server.address()
    const host = address.address === '::' ? 'localhost' : address.address
    // by using a bound function, we can access options as `this`
    const protocol = this.https ? 'https' : 'http'
    console.log(`Server listening at ${protocol}://${host}:${address.port}/`)
  }
})
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Contributions and feedback are very welcome.

This project aims to stay lean and close to standards. New features should encourage to stick to standards. Options that match the behaviour of [webpack-dev-server](https://webpack.js.org/configuration/dev-server/#devserver) are always ok.

To get it running:

1. Clone the project.
2. `pnpm install`
3. `pnpm build`

## Credits

- [Thomas Ghysels](https://github.com/thgh)
- [Aarstein Media](https://github.com/aarsteinmedia)
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-author]: https://github.com/thgh
[link-contributors]: ../../contributors
[rollup-plugin-opener]: https://www.npmjs.com/package/rollup-plugin-opener
