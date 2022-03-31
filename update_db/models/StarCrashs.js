const mongoose = require("mongoose")

let StarCrashs = new mongoose.model("StarCrashs", {
    email_user:String,
    plan_status:String,
    plan_id:String,
    max_date:String,
    min_date:String,
    page_find:String,
    date_payment:String
})

module.exports = StarCrashs;