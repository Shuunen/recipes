module.exports = {
  purge: {
    mode: 'all',
    enabled: true,
    content: [
      './src/*.js',
      './public/*.html'
    ]
  },
  theme: {
    extend: {},
    container: {
      center: true
    }
  },
  variants: {},
  plugins: []
}
