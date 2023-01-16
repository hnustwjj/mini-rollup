import path from 'path'
import axios from 'axios'
import rollup from './lib/rollup'
const entry = path.resolve(__dirname, 'src/main.ts')

rollup(entry, 'bundle.js')
