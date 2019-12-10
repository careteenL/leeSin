const express = require('express')
const path = require('path')
const fs = require('fs')
const opn = require('opn')

const app = express()

fs.copyFileSync(
  path.resolve(__dirname, `../dist/leeSin.js`),
  path.resolve(__dirname, `./public/js/leeSin.js`)
)

// TODO add copy assets
// fs.copyFileSync(
//   path.resolve(__dirname, `../assets/leesin.jpeg`),
//   path.resolve(__dirname, `./public/img/leesin.jpeg`)
// )

app.use(express.static(path.resolve(__dirname, './public')))

app.get('/', (res, req) => {
  res.redirect('/index.html')
})

app.listen(15566, _ => {
  console.log('listen to http://localhost:15566')
  opn('http://localhost:15566')
})