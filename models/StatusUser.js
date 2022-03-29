const mongoose = require("mongoose")

let StatusUser = new mongoose.model("StatusUser", {
    user_id:Number,
    started:Boolean,
    finished:Boolean,
    existent:Boolean
})

module.exports = StatusUser;