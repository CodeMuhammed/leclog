var connect = require("connect");
var serveStatic = require("serve-static");
var app =connect();
app.use(serveStatic('src'));
app.listen(process.env.PORT || 7000);
console.log("server running at localhost:7000");