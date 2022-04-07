const mongoose = require("mongoose")

let StatusUser = new mongoose.model("StatusUser", {
    user_id:Number,
    started:Boolean,
    finished:Boolean,
    finding:Boolean,
    existent:Boolean,
    starcrashUsed:Boolean
})

module.exports = StatusUser;
