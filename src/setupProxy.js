const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/geoserver",
    createProxyMiddleware({
      target: process.env.REACT_APP_GEOSERVER_MAPEO_API,
      changeOrigin: true,
    })
  );
};
