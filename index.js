const fs = require('fs')
const http = require('http')
const url = require('url')

// ********** FILES WRITE AND READ ********** //
// Blocking, Aynchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('The file has been written!');

// Non-Blocking, Aynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.error('Error!');
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('Your file has been written!!');
//       });
//     });
//   });
// });
// console.log('Reading file ...');

// ********** SERVER ********** //
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCT_NAME%}/g, product.productName)
  output = output.replace(/{%PRODUCT_ICON%}/g, product.image)
  output = output.replace(/{%PRODUCT_QUANTITY%}/g, product.quantity)
  output = output.replace(/{%PRODUCT_PRICE%}/g, product.price)
  output = output.replace(/{%PRODUCT_FROM%}/g, product.from)
  output = output.replace(/{%PRODUCT_NUTRIENTS%}/g, product.nutrients)
  output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description)
  output = output.replace(/{%PRODUCT_ID%}/g, product.id)

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
  }

  return output
}

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
)
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
)
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
)
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
  const pathName = req.url
  switch (pathName) {
    case '/':
      res.writeHead(200, {
        'Content-type': 'text/html',
      })
      const cardsHtml = dataObj
        .map((el) => replaceTemplate(tempCard, el))
        .join('')
      const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
      res.end(output)
      break
    case '/overview':
      res.writeHead(200, {
        'Content-type': 'text/html',
      })
      res.end(tempOverview)
      break
    case '/product':
      res.writeHead(200, {
        'Content-type': 'text/html',
      })
      res.end(tempProduct)
      break
    case '/api':
      res.writeHead(200, {
        'Content-type': 'application/json',
      })
      res.end(dataObj)
      break
    default:
      res.writeHead(404, {
        'Content-type': 'text/html',
      })
      res.end('<h1>404 Page not found!</h1>')
      break
  }
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000')
})
