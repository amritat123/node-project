const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URL, {
    // useMongoClient: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then((res) => {
    console.log("mongoDB connected successfully");
  })
  .catch((err) => {
    console.log("db not connected", err);
    process.exit(1);
  });
console.log("Is MongoDB connected:", mongoose.connection.readyState);

module.exports = mongoose;
