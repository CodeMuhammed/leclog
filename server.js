var connect = require("connect");
var serveStatic = require("serve-static");
var app =connect();
app.use(serveStatic('project-tiwit'));
app.listen(7000);
console.log("server running at localhost:7000");