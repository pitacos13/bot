const mongoose = require("mongoose")

let UsersKey = new mongoose.model("UsersKey", {
    user_id:Number,
    keyused:Boolean
})

module.exports = UsersKey;