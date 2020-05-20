const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/geoserver",
    createProxyMiddleware({
      target: "https://dev.mapeo.be/",
      changeOrigin: true,
    })
  );
};
