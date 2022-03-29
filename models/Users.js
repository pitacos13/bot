const mongoose = require("mongoose")

let Users = new mongoose.model("Users", {
    user_id:Number,
    email_user:String,
    plan_name:String,
    status_plan:Boolean
})

module.exports = Users;