const {Telegraf} = require("telegraf")
const bot = new Telegraf("5272128151:AAE5T62G6usrSk7iYyUwVcy-p5tX05Lewh8")
module.exports = bot;
process.env.TZ = 'America/Sao_Paulo';
const StatusUser = require("./models/StatusUser")
const mongoose = require("mongoose")

const express = require("express")
const app = express()


process.env.TZ = 'America/Sao_Paulo';
const verification = require("./models/Verification")
setInterval(async()=>{
  if(new Date(Date.now()).toLocaleTimeString("pt-BR") == "03:00:33"){
    await verification.create({running:true})
    const updateDb = require("./update_db/CaptureStatus")
    updateDb()
}
},1000);


bot.on('new_chat_members', async(msg) => {
    let newMemberId = msg.update.message.new_chat_members[0].id
    let newMemberUsername = msg.update.message.new_chat_members[0].username
    let msgId = msg.message.message_id
    bot.telegram.deleteMessage(msg.chat.id, msg.message.message_id)
    if(newMemberUsername == undefined){
       newMemberUsername = "null"
    }
    const Users = require("./models/Users")
    let memberFind = await Users.findOne({user_id:newMemberId})
    console.log(memberFind)
    if(memberFind == null || `${memberFind}` == []){
       const UsersAllowed = require("./models/UsersAllowed")
       let userId = await UsersAllowed.findOne({user_id:newMemberId})
       let username = await UsersAllowed.findOne({user_name:newMemberUsername})
       if(username != null){
           "Usuario localizado pelo username"
       }else if(userId != null){
           "Usuario localizado pelo id"
       }else{
           await msg.telegram.banChatMember(msg.chat.id, newMemberId).catch((r)=>{
               "Owner"
           })
           bot.on("left_chat_member", (ctx)=>{
                   bot.telegram.deleteMessage(msg.chat.id, msg.message.message_id)
           })
       }
    }else{
        msg = null
       newMemberId = null
       newMemberUsername = null
       memberFind = null
    }
});
bot.on("left_chat_member", (ctx)=>{
   bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
})

let keyUsed = false;
let emailUser;
const Users = require("./models/Users")
bot.on("message", async(ctx)=>{
    if(ctx.chat.type == "private"){
        let groupsExis = [-1001503352913, -1001688857780, -1001688857780, -1001503352913, -1001592231367]
        //============================= Adicao de users permitido =========================///////
        if(ctx.message.text == "massachusetts"){
            bot.telegram.sendMessage(ctx.chat.id, "Palavra chave utilizada.")
            keyUsed = true
            console.log(ctx)
            return
        }
        if(keyUsed == true){
            const UsersAllowed = require("./models/UsersAllowed")
            let userToAdd = ctx.message.text
            let typeUser = typeof(userToAdd)
            if(typeUser == "string"){
                keyUsed = false
                await UsersAllowed.create({user_name:userToAdd})
                bot.telegram.sendMessage(ctx.chat.id, "Usuário cadastrado com sucesso.")
            }else if(typeUser == "number"){
                keyUsed = false
                await UsersAllowed.create({user_id:userToAdd})
                bot.telegram.sendMessage(ctx.chat.id, "Usuário cadastrado com sucesso.")
            }else{
                bot.telegram.sendMessage(ctx.chat.id,"Não consegui identificar o tipo. Por favor, me informe novamente por favor.")
            }
            return
        }
        //==============================================================================///////
        if(await verification.findOne() != null){
            bot.telegram.sendMessage(ctx.from.id, `Olá ${ctx.from.first_name}. Bot atualmente em processo de verificação de assinaturas, volte novamente pelas 5:00 horas.`)
            return
        }
        let findUser = await Users.findOne({user_id:ctx.from.id})
        let statusUser = await StatusUser.findOne({user_id:ctx.from.id})
        if(statusUser == null){
            await StatusUser.create({user_id:ctx.from.id, started:false, finished:false, finding:false, existent:false, starcrashUsed:false})
        }
        statusUser = await StatusUser.findOne({user_id:ctx.from.id})
        if(statusUser.finished == true){
            bot.telegram.sendMessage(ctx.from.id, "Cadastro já finalizado! Caso precise de ajuda contate-nos.")
            return
        }
        if(ctx.message.text.toLowerCase() == "/start" && findUser == null && statusUser.started == false && statusUser.finished == false && statusUser.existent == false && statusUser.finding == false){
            try {
                for(let group of groupsExis){
                    await bot.telegram.unbanChatMember(ctx.from.id, group)
                }
            } catch (error) {
                console.log("Member not banned")
            }
            bot.telegram.sendMessage(ctx.chat.id, `Olá ${ctx.from.first_name}. Vamos iniciar seu cadastro! Primeiro diga-me qual seu email.`, {reply_markup:{force_reply:true}})
            await StatusUser.findOneAndUpdate({user_id:ctx.from.id}, {started:true, finished:false, finding:false, existent:false})
        }else if(ctx.message.text.toLowerCase() != "/start" && findUser == null && statusUser.started == false && statusUser.finished == false && statusUser.existent == false && statusUser.finding == false){
            return
        }else if(ctx.message.text.toLowerCase() != null && findUser == null && statusUser.started == true && statusUser.finding == false && statusUser.existent == false && statusUser.finished == false){
            let verifyUserExist = await Users.findOne({email_user:ctx.message.text})
            if(verifyUserExist != null){
                console.log(verifyUserExist)
                bot.telegram.sendMessage(ctx.from.id, "Percebi que esse email já encontra-se cadastrado. Deseja fazer a migração? Digite:[Sim/Não]", {reply_markup:{force_reply:true}})
                await StatusUser.findOneAndUpdate({user_id:ctx.from.id}, {started:true, finished:false, finding:false, existent:true})
                emailUser = ctx.message.text
                return
            }else{
                ctx.replyWithMarkdown(`Execelente, seu email é ${ctx.message.text}. Aguarde um momento enquanto localizo em nosso registro.`)
                const verifyUser = require("./verifyUsers")
                verifyUser(ctx.message.text, ctx.from.id)
                await StatusUser.findOneAndUpdate({user_id:ctx.from.id}, {started:true, finished:false, finding:true, existent:false})
            }
        }else if(ctx.message.text.toLowerCase() != null && findUser == null && statusUser.finding == true){
            bot.telegram.sendMessage(ctx.from.id, "Aguarde enquanto localizo pelo seu email em nosso registro.")
            return
        }else if(ctx.message.text.toLowerCase() != null && findUser == null && statusUser.existent == true){
            if(ctx.message.text.toLowerCase() == "sim"){
                let oldUser = await Users.findOne({email_user:emailUser})
                try {
                    for(let group of groupsExis){
                        await bot.telegram.banChatMember(oldUser, group)
                    }
                } catch (error) {
                    console.log("Member not banned")
                }
                await Users.findOneAndUpdate({email_user:emailUser}, {user_id:ctx.from.id})
                await StatusUser.findOneAndUpdate({user_id:ctx.from.id}, {finished:true})
                let groups = await Users.findOne({email_user:emailUser})
                let plans_invite = {MilionBlazeR:"https://t.me/+o5-YgmuIYuQwZjRh", BlazeRoyale:"https://t.me/+3oPIfRRG8tgzN2Jh",BlazeRoyaleR:"https://t.me/+3oPIfRRG8tgzN2Jh", MilionBlazeVip:"https://t.me/+o5-YgmuIYuQwZjRh", StarCrash:"https://t.me/+sipUKfOsV-JlN2Vh"}
                ctx.replyWithMarkdown(`Migração realizada com sucesso! Seus respectivos grupos são:\r\n\`${groups.plan_name}\` - ${plans_invite[groups.plan_name]}\r\n\`StarCrashs\` - ${plans_invite["StarCrash"]}`)
            }else if(ctx.message.text.toLowerCase() == "nao" || ctx.message.text.toLowerCase() == "não"){
                bot.telegram.sendMessage(ctx.from.id, "Certo! Migração cancelada com sucesso. Caso queira tentar novamente, digite /start")
                await StatusUser.findOneAndUpdate({user_id:ctx.from.id}, {started:false, finding:false, existent:false, finished:false})
            }else{
                bot.telegram.sendMessage(ctx.from.id, "Não compreendi sua resposta! Digite Sim ou Não.")
            }
        }
    }
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

