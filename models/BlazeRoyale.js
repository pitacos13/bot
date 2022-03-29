const mongoose = require("mongoose")

let BlazeRoyale = new mongoose.model("BlazeRoyale", {
    email_user:String,
    plan_status:String,
    plan_id:String,
    max_date:String,
    min_date:String,
    page_find:String
})

module.exports = BlazeRoyale;