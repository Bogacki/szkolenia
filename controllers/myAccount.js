const { checkIfLogged, logout } = require("../libs/login");
const mongoose = require("mongoose");
const { toLower, trim } = require("lodash");
const md5 = require("md5");
const Users = mongoose.model("User");

const myAccountCheckRoute = (req, res) => {
  if (!checkIfLogged(req)) res.redirect("/");
  Users.findOne({ login: req.cookies["_logged"] })
    .then((loggedUser) => {
      if (loggedUser) {
        res.render("myAccount", {
          title: "MyAccount",
          loggedCookie: checkIfLogged(req),
          error: "",
          deleteFunction: "",
          loggedUser: loggedUser,
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};

const changeMyAccountData = (req, res) => {
  let login = toLower(req.body.login);
  let email = req.body.email;
  let phone = trim(req.body.phone);
  let fName = trim(req.body.fName);
  let lName = trim(req.body.lName);
  if (!checkIfLogged(req)) res.redirect("/");
    Users.findOne({ login: login })
    .then((loggedUser) => {
      if (!loggedUser || req.cookies["_logged"] === login) {
        Users.updateOne(
          {
            login: req.cookies["_logged"],
          },
          {
            login: login,
            contact: {
              firstName: fName,
              lastName: lName,
              email: email,
              phone: phone,
            },
          }
        )
          .then(() => {
            res.clearCookie("_logged");
            res.cookie("_logged", login, {
              maxAge: 2 * 60 * 60 * 1000,
              httpOnly: true,
            });
            res.redirect("/");
          })
          .catch((err) => {
            console.log(err);
          });

      } else {
        res.render("myAccount", {
          title: "My Account",
          loggedCookie: checkIfLogged(req),
          error: `${login} user already exists`,
          deleteFunction: "",
          loggedUser: loggedUser,
        });
      }
    });
};


const getAccountData = (req, res) => {
  Users.findOne({login: req.cookies["_logged"]})
  .then((loggedUser) => {
    if(loggedUser.role === "Admin"){
    const searchedUser = req.params.userLogin;
    if (!checkIfLogged(req)) res.redirect("/");
      Users.findOne({ login: searchedUser })
      .then((foundUser) => {
        res.render("accountPanel", {
          title: foundUser.login,
          loggedCookie: checkIfLogged(req),
          user: foundUser,
          error: "",
          deleteFunction: "",
          loggedUser: loggedUser,
        });
      }).catch((err) => {
        console.log(err);
        res.redirect('/')
      });
    }else{
      res.redirect('/');
    }
  }).catch((err) => {
    console.log(err);
  }) 
};


const changeAccountData = (req, res) => {
  let login = toLower(req.body.login);
  let password = md5(req.body.password);
  let email = req.body.email;
  let phone = trim(req.body.phone);
  let fName = trim(req.body.fName);
  let lName = trim(req.body.lName);
  let role = req.body.role;
  Users.findOne({login: req.cookies["_logged"]})
  .then((loggedUser) => {
    if(loggedUser.role === "Admin"){
    const searchedUser = req.params.userLogin;
    if (!checkIfLogged(req)) res.redirect("/");
    Users.updateOne(
      {
        login: searchedUser,
      },
      {
        login: login,
        password: password,
        contact: {
          firstName: fName,
          lastName: lName,
          email: email,
          phone: phone,
        },
        role: role,
      }
    )
      .then(() => {
        res.redirect("/adminPanel");
      })
      .catch((err) => {
        console.log(err);
      });
    }else{
      res.redirect('/');
    }
  }).catch((err) => {
    console.log(err);
  }) 
};







module.exports = {
  myAccountCheckRoute,
  changeMyAccountData,
  getAccountData,
  changeAccountData
};
