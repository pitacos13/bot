const mongoose = require("mongoose")

let UsersAllowed = new mongoose.model("UsersAllowed", {
    user_id:Number,
    user_name:String,
    recived:Boolean
})

module.exports = UsersAllowed;
