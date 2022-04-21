const mongoose = require("mongoose")

let PlanStatus = new mongoose.model("PlansWebhookBraip", {
    email_user:String,
    plan_status:String,
    plan_key:String,
    date_payment:String,
    plan_name:String
})

module.exports = PlanStatus;
