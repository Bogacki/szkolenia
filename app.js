const express = require("express");
const app = express();
const _ = require("lodash");
const cookieParser = require("cookie-parser");
const loginCnt = require("./controllers/authenticate");
const myAccountCnt = require("./controllers/myAccount");
const adminPanelCnt = require("./controllers/adminPanel");
const trainingsCnt = require("./controllers/training");
const flash = require("connect-flash");

app.use(cookieParser());
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", loginCnt.homeCheckRoute);

app.get("/login", loginCnt.loginCheckRoute);

app.post("/login", loginCnt.login);

app.get("/register", loginCnt.registerCheckRoute);

app.post("/register", loginCnt.register).check;

app.get("/logout", loginCnt.logoutController);

app.get("/myAccount", myAccountCnt.myAccountCheckRoute);

app.post("/myAccount", myAccountCnt.changeMyAccountData);

app.get("/adminPanel", adminPanelCnt.adminPanelCheckRoute);

app.get("/adminPanel/:userLogin", myAccountCnt.getAccountData);

app.post("/adminPanel/:userLogin", myAccountCnt.changeAccountData);

app.get("/trainings", trainingsCnt.trainingCheckRoute);

app.get("/trainings/newTraining", trainingsCnt.newTrainingCheckRoute);

app.post("/trainings/newTraining", trainingsCnt.addNewTraining);


app.listen(3000, () => {
  console.log("App is up");
});
