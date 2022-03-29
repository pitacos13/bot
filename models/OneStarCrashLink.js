const mongoose = require("mongoose")

let OneStarCrashLink = new mongoose.model("OneStarCrashLink", {
    email_user:String,
    starused:Boolean
})

module.exports = OneStarCrashLink;