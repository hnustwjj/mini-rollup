const spawn = require('cross-spawn')

spawn.sync('rm', ['-rf', './dist'], { stdio: 'inherit' })
spawn.sync('tsc', { stdio: 'inherit' })
console.log(1)
spawn.sync('node', ['./dist/index.js'], { stdio: 'inherit' })
