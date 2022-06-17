const { checkIfLogged, logout } = require("../libs/login");
const mongoose = require("mongoose");
const md5 = require("md5");
const Users = mongoose.model("User");

const adminPanelCheckRoute = (req, res) => {
    try{
    Users.find().then((users) => {
        checkIfLogged(req) ? res.render('adminPanel', {title: "Admin panel", loggedCookie: (checkIfLogged(req)), users: users}) : res.redirect('/');
    });
    }catch(err){
        console.log(err);
    }
}


module.exports = {
  adminPanelCheckRoute,
};
