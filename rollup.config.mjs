export default {
  input: './src/main.js',
  output: {
    file: './rollup-dist/bundle.js',
    format: 'cjs',
    name: 'myBundle', // iife, umd的全局变量名
  },
}
