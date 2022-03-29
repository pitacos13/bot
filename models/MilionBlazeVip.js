const mongoose = require("mongoose")

let MilionBlazeVip = new mongoose.model("MilionBlazeVip", {
    email_user:String,
    plan_status:String,
    plan_id:String,
    max_date:String,
    min_date:String,
    page_find:String
})

module.exports = MilionBlazeVip;