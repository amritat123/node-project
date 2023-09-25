const app = require("./app");
const http = require("http");
require("dotenv").config();

// Server running PORT
const port = process.env.PORT || 5000;
console.log(`Server started on port ${port}`);
const server = http.createServer(app);
server.listen(port);
