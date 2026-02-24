const App = require("express").Router()
const LoginTeam = require("./LoginTeam.route")
const UserTeam  = require ("./UserTeam.route")
App.use()

App.use("./LoginTeam" ,LoginTeam)
App.use("./UserTeam", UserTeam)
module.exports = App;