import path from 'path'
import { fileURLToPath } from 'url'
import rollup from './lib/rollup'
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const entry = path.resolve(__dirname, 'src/main.ts')

rollup(entry, 'bundle.js')
