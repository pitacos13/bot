const mongoose = require("mongoose")

let Users = new mongoose.model("UsersStatusMonetizze", {
    email:String,
    blazeroyale:Boolean,
    millionblaze:Boolean,
    user_id:Number,
    finding:Boolean,
    initialized:Boolean,
    finished:Boolean,
    existent:Boolean
})

module.exports = Users;
