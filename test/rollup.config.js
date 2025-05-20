// eslint-disable-next-line no-restricted-imports, import/no-useless-path-segments
import serve from '../dist/index.js'

const testOnListening = () => {
  const timeout = 3
  const timer = setTimeout(() => {
    const msg = `onListening was not called within ${timeout}s`

    console.error(msg)
    throw new Error(msg)
  }, timeout * 1000)

  return (server) => {
    clearTimeout(timer)
    console.info('onListening works', server.address())
  }
}

const test = {
  input: 'entry.js',
  output: {
    file: 'dest.js',
    format: 'esm'
  },
  plugins: [
    serve({
      browser: 'safari',
      contentBase: ['.',
        'base1',
        'base2',
        'base3'],
      historyApiFallback: '/fallback.html',
      mimeTypes: { 'text/x-abc': ['abc'] },
      onListening: testOnListening(),
      open: true,
      openPage: '/frames.html'
    })
  ],
  watch: { clearScreen: false }
}

export default test
