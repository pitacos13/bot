const mongoose = require("mongoose")

let BlazeRoyaleR = new mongoose.model("BlazeRoyaleR", {
    email_user:String,
    plan_status:String,
    plan_id:String,
    max_date:String,
    min_date:String,
    page_find:String,
    date_payment:String
})

module.exports = BlazeRoyaleR;