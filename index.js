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

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
  console.log(req.url)
  const pathName = req.url
  switch (pathName) {
    case '/':
      res.writeHead(200, {
        'Content-type': 'text/html',
      })
      res.end('<h1>This is HOME</h1>')
      break
    case '/overview':
      res.writeHead(200, {
        'Content-type': 'text/html',
      })
      res.end('<h1>This is OVERVIEW</h1>')
      break
    case '/product':
      res.writeHead(200, {
        'Content-type': 'text/html',
      })
      res.end('<h1>This is PRODUCT</h1>')
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
