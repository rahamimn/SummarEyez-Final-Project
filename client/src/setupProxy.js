const { createProxyMiddleware } = require('http-proxy-middleware');

console.log(process.env.PROD);
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.PROD ? 'http://132.72.23.63:3091' : 'http://localhost:4000',
      changeOrigin: true,
    })
  );
};