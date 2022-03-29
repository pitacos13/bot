const mongoose = require("mongoose")

let UsersAllowed = new mongoose.model("UsersAllowed", {
    user_id:Number,
    user_name:String
})

module.exports = UsersAllowed;