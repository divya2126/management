const mongoose = require("mongoose");
const express = require ("express");
const cors = require ("cors");

const app = express();
app.use(express.json());

app.use(cors({
    origin:["http://localhost:5173", "http://localhost:5174"],
    methods:["Get", "post" ,"put", "delete"]
}));
mongoose.connect('mongodb+srv://Divya21:DlsdxgyP2qcFO3BX@managementcollege.k7urguh.mongodb.net/managementDB')
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch((err) => console.log("❌ MongoDB Connection Error:", err));