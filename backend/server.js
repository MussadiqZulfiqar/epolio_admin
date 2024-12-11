const app = require("./app");
const mongoose = require("mongoose");
//unhandled Exception
process.on("uncaughtException", (err) => {
  console.log("uncaughtException:" + err);
});
const server = app.listen(4000, () => {
  console.log("listening");
});
//database connection
mongoose.connect(process.env.DATABASE).then((data) => {
  console.log(`Connected to database:${data.connection.host}`);
});
//unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log("Unhandeled rejection:", err.message);

  server.close(() => {
    process.exit(1);
  });
});
