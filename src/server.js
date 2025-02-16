const http = require('http');
const htmlResponses = require('./htmlResponses');
const dataResponses = require('./dataResponses');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const router = {
  '/': htmlResponses.getIndex,
  '/style.css': htmlResponses.getCSS,
  '/success': dataResponses.success,
  '/badRequest': dataResponses.badRequest,
  '/unauthorized': dataResponses.unauthorized,
  '/forbidden': dataResponses.forbidden,
  '/internal': dataResponses.internal,
  '/notImplemented': dataResponses.notImplemented,
  notFound: dataResponses.notFound,
};

const handler = (req, res) => {
  const protocol = req.connection.encrypted ? 'https' : 'http';

  const parsedUrl = new URL(req.url, `${protocol}://${req.headers.host}`);
  req.query = Object.fromEntries(parsedUrl.searchParams);
  req.acceptedTypes = req.headers.accept.split(',');

  if (router[parsedUrl.pathname]) {
    router[parsedUrl.pathname](req, res);
  } else {
    router.notFound(req, res);
  }
};

http.createServer(handler).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
