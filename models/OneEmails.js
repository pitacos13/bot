const mongoose = require("mongoose")

let OneEmails = new mongoose.model("OneEmails", {
    email_user:String,
    starused:Boolean
})

module.exports = OneEmails;