// jshint esversion:6
require("dotenv").config();

const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser").json()

const app = express()
app.set('view engine', 'ejs')
app.use(bodyParser)
app.use(express.static("public"))

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})

const taskSchema = new mongoose.Schema({
    description: String,
    completed: Boolean
})

const Task = mongoose.model("Task", taskSchema)

app.route("/")
.get(function async (req, res){
   Task.find(
    {
      completed: false
    }
  ).then(
    resp => {
      console.log(resp);
      res.status(200).json(resp)
    },
    err => {
      console.log(err);
      res.status(404).send(err.message)
    }
  )
})

.post(async function(req, res){

  const newTask = new Task({
    description: req.body.description,
    completed: req.body.completed
  })

  await newTask.save()
  .then(
    resp => {
      console.log(resp);
      res.status(200).json(resp)
    },
    err => {
      console.log(err);
      res.status(404).send(err.message)
    }
  )

})

.patch(async function(req, res){
  await Task.updateMany(
    {
      completed : false
    },
    {
        $set: {completed: true}
    }
  ).then(
    resp => {
      console.log("Updated");
      res.status(200).send("Updated")
    },
    err => {
      console.log(err);
      res.status(404).send(err.message)
    }
  )
});

app.route("/:taskId")
.delete(async function(req, res){

  await Task.deleteOne(
    {
      _id: req.params.taskId
    }
  ).then(
    resp => {
      console.log("Deleted succesfully");
      res.status(201).send("Deleted succesfully")
    },
    err => {
      console.log(err);
      res.status(404).send(err.message)
    }
  )
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Running....");
});