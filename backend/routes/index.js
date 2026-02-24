const Route = require("express").Router()
const apiroutes = require("./api/index")
Route.use("/api",apiroutes)
Route.use("./api",(req , res , next ) => {
          res.json("status not found")
})

module.exports = Route;
