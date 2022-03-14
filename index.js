const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

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

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((slug) => slugify(slug.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  switch (pathname) {
    case "/":
    case "/overview":
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      const cardsHtml = dataObj
        .map((el) => replaceTemplate(tempCard, el))
        .join("");
      res.end(tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml));
      break;
    case "/product":
      const product = dataObj[query.id];
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      res.end(replaceTemplate(tempProduct, product));
      break;
    case "/api":
      res.writeHead(200, {
        "Content-type": "application/json",
      });
      res.end(dataObj);
      break;
    default:
      res.writeHead(404, {
        "Content-type": "text/html",
      });
      res.end("<h1>404 Page not found!</h1>");
      break;
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
