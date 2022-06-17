const mongoose = require("mongoose");

const fs = require("fs");

fs.readdirSync(__dirname).forEach((file) => {
  require("./" + file);
});

const uri =
  "mongodb+srv://admin-mikolaj:9LQ0aKsNdMYxf5OB@cluster0.9xk9u.mongodb.net/movix";
mongoose.connect(uri);
