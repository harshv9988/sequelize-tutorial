const express = require("express");
const app = express();

const port = 8000;

require("./models/index");
const userCtrl = require("./controller/userController");

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/add", userCtrl.addUser);
app.get("/crud", userCtrl.crudOperation);
app.get("/one", userCtrl.oneToOne);
app.get("/belongone", userCtrl.belongToOne);
app.get("/many", userCtrl.manyToMany);
app.get("/scope", userCtrl.scopes);

app.listen(port, () => {
  console.log("server started at port 8000");
});
