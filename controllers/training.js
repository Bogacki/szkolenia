const { checkIfLogged, logout } = require("../libs/login");
const models = require("../models");
const mongoose = require("mongoose");
const { check } = require("express-validator");
const { templateSettings } = require("lodash");
const Trainings = mongoose.model("Training");
const Users = mongoose.model("User");

const trainingCheckRoute = (req, res) => {
  if (!checkIfLogged(req)) res.redirect("/login");

  Users.findOne({login: req.cookies["_logged"]})
  .then((loggedUser) => {
  Trainings.find().then((trainings)=>{
    res.render("trainings", {title: "Trainings", loggedCookie: checkIfLogged(req), trainings: trainings, loggedUser: loggedUser});
  }).catch((err)=>{
    console.log(err);
    res.render("trainings", {title: "Trainings", loggedCookie: checkIfLogged(req), trainings: [], loggedUser: loggedUser});
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

const deleteTraining = (req, res) => {
  if (!checkIfLogged(req)) res.redirect("/login");
  const trainingId = req.params.trainingId;
  Users.findOne({login: req.cookies["_logged"]})
  .then((loggedUser) => {
    if(loggedUser.role != "Student"){
  Trainings.deleteOne({_id: trainingId}).then(()=>{
    res.redirect('/trainings');
  });
}else{
  res.redirect('/trainings');
}
});
};

const signForTraining = (req, res) => {
  if (!checkIfLogged(req)) res.redirect("/login");
  const trainingId = req.params.trainingId
  Users.findOne({login: req.cookies["_logged"]})
  .then((loggedUser) => {
    Trainings.findOne({_id: trainingId}).then((training)=>{
      let participants = training.participants;
      let userIsSigned = participants.filter(e => e === loggedUser.login).length > 0;
      if(userIsSigned){
        Trainings.findOneAndUpdate({_id: trainingId},{ $pull: {participants: loggedUser.login}}).then(()=>{
          res.redirect('/trainings');
        });
      }else{
        Trainings.findOneAndUpdate({_id: trainingId},{ "$push": {"participants": loggedUser.login}}).then(()=>{
          res.redirect('/trainings');
        });
      }
    });
});
};



const trainingDetailsCheckRoute = (req, res) => {
  if (!checkIfLogged(req)) res.redirect("/login");
  const trainingId = req.params.trainingId


  Users.findOne({login: req.cookies["_logged"]})
  .then((loggedUser) => {
  Trainings.findOne({_id: trainingId}).then((training)=>{
    res.render("trainingDetails", {title: training.title, loggedCookie: checkIfLogged(req), loggedUser: loggedUser, training: training, deleteFunction: deleteTraining.bind(res)});
  }).catch((err)=>{
    console.log(err);
    res.render("trainingDetails", {title: training.title, loggedCookie: checkIfLogged(req), loggedUser: loggedUser, training: {}});
  });
  }).catch((err)=>{
    console.log(err);
  });
};



module.exports = {
  trainingCheckRoute,
  newTrainingCheckRoute,
  addNewTraining,
  trainingDetailsCheckRoute,
  deleteTraining,
  signForTraining
};
