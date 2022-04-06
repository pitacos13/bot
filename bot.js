const {Telegraf} = require("telegraf")
const bot = new Telegraf("5272128151:AAE5T62G6usrSk7iYyUwVcy-p5tX05Lewh8")
module.exports = bot;
process.env.TZ = 'America/Sao_Paulo';
let started = false
let finished = false
let finding = false;
let existent = false;
const mongoose = require("mongoose")

const express = require("express")
const app = express()

app.get("/", (req,res)=>{
    res.json({status:"Bot running!", version:"v1"})
})


app.listen(3000, ()=>{
    console.log("Server running in port 3000")
})

process.env.TZ = 'America/Sao_Paulo';
const verification = require("./models/Verification")
setInterval(async()=>{
  if(new Date(Date.now()).toLocaleTimeString("pt-BR") == "03:00:33"){
    await verification.create({running:true})
    const updateDb = require("./update_db/CaptureStatus")
    updateDb()
}
},1000);

bot.on("new_chat_member", (ctx)=>{
    bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
})

bot.on("left_chat_member", (ctx)=>{
    bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
})





bot.launch()
async function ConnectDb(){
    let user = "botTelegram"
    let password = "bottelegram2022"
    mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.e60ei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(()=>{
      console.log("Connected with sucess")
    }).catch((e)=>{
      console.log(e)
    })
}ConnectDb()


