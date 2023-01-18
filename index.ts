import path from 'path'
import rollup from './lib/rollup'
// const entry = 'D:\\code\\learn-rollup\\src\\main.js'

const entry = '/Users/bytedance/Desktop/code/mini-rollup/src/main.js'
rollup(entry, 'bundle.js')
