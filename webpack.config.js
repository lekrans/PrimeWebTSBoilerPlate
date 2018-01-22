const resolve = require('path').resolve;

module.exports = {
 entry: './src/main.js',
 output: {
   path: resolve(__dirname, 'dist'),
   filename: 'bundle.js'
 },
 devServer: {
   contentBase: resolve(__dirname, ""),
   noInfo: true,
   port: 8081,
   publicPath: "/dist/",
   headers: {
     "Access-Control-Allow-Origin": "*",
     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
     "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
   },
   open: 'http://localhost:8081/dist/index.html',
 },
 watch: true
}
