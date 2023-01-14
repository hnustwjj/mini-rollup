export default {
  input: './src/marin.js',
  output: {
    file: './dist/bundle.js',
    format: 'cjs',
    name: 'myBundle', // iife, umd的全局变量名
  },
}
