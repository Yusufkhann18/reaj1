const http = require("http");
const app = require("./app");

const server = http.createServer(app);
let PORT = 3000;
server.listen(PORT, function () {
  console.log(
    `The Server is running successfully on port: ${PORT}, http://localhost:${PORT}`,
  );
});
