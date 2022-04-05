const mongoose = require("mongoose")

let Verification = new mongoose.model("Verification", {
    running:Boolean
})

module.exports = Verification;