const { checkIfLogged, logout } = require("../libs/login");
const models = require("../models");
const mongoose = require("mongoose");
const { check } = require("express-validator");
const Trainings = mongoose.model("Training");
const Users = mongoose.model("User");

const trainingCheckRoute = (req, res) => {
  if (!checkIfLogged(req)) res.redirect("/login");

  Users.findOne({login: req.cookies["_logged"]})
  .then((loggedUser) => {

  Trainings.find().then((trainings)=>{
  console.log(trainings[0])
    res.render("trainings", {title: "Trainings", loggedCookie: checkIfLogged(req), trainings: trainings});
  }).catch((err)=>{
    console.log(err);
    res.render("trainings", {title: "Trainings", loggedCookie: checkIfLogged(req), trainings: []});
  });
  }).catch((err)=>{
    console.log(err);
  });
};

const newTrainingCheckRoute = (req, res) => {
  
    Users.find({role: "Teacher"}).then((users)=>{
      if (!checkIfLogged(req)) res.redirect("/login");
      if(users){
        res.render("addNewTraining", {title: "New Training", loggedCookie: checkIfLogged(req), error: '', hosts: users});
      }else{
        res.render("addNewTraining", {title: "New Training", loggedCookie: checkIfLogged(req), error: '', hosts: []});
      }

    }).catch((err)=>{
      console.log(err);
      res.redirect('/trainings');
    });
};

const addNewTraining = (req, res) => {
  const title = req.body.title;
  const duration = req.body.duration;
  const host = req.body.host;
  const datetime = new Date(req.body.datetime).toLocaleString("pl-PL", {dateStyle: "short", timeStyle: "short"});
  
  try {
    Trainings.create({title: title, duration: duration, host: host, date:datetime}).then(()=>{
      res.redirect('/trainings');
    }).catch((err)=>{
      console.log(err);
    })
  } catch (err) {
    console.log(err);
  }
};



module.exports = {
  trainingCheckRoute,
  newTrainingCheckRoute,
  addNewTraining
};
