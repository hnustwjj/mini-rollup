import path from 'path'
import rollup from './lib/rollup'
const entry = path.resolve(__dirname, './src/main.js')

rollup(entry, 'bundle.js')
