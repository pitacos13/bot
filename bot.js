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

bot.on("left_chat_member", (ctx)=>{
    bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
})

bot.on("left_chat_member", (ctx)=>{
    bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
})


const StatusUser = require("./models/StatusUser")
let emailSaved;
let groups = []
let keyUsed = false;
bot.on("message", async(ctx)=>{
 if(ctx.chat.type == "private"){
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
                bot.telegram.sendMessage("Não consegui identificar o tipo. Por favor, me informe novamente por favor.")
            }
            return
        }
        let userStatus = await StatusUser.findOne({user_id:ctx.chat.id})
        const Users = require("./models/Users")
        let userToJoin = Users.findOne({user_id:ctx.from.id})
        let groupsExis = [{MilionBlazeR:-1001503352913, BlazeRoyale:-1001688857780,BlazeRoyaleR:-1001688857780, MilionBlazeVip:-1001503352913, StarCrash:-1001592231367}]
           if(userToJoin == null){
            for(let group of groupsExis){
                for(let i in group){
                    try {
                        bot.telegram.unbanChatMember(group[i], ctx.from.id).catch((r)=>{
                            "Owner"
                        })  
                    } catch (error) {

                    }
                  }
        }
           }
        // Usuarios já existentes
        try {
            if(userStatus.existent == true){
                if(userStatus.finished != true){
                    //Pegar todos grupos que o usuario possui permissão:
                   
                    let messageToLower = ctx.message.text.toLowerCase()
                    if(messageToLower == "sim"){
                        finished = true
                        let Users = require("./models/Users")
                        let userExist = await Users.find({user_email:emailSaved})
                        let plans = [{MilionBlazeR:-1001503352913, BlazeRoyale:-1001688857780,BlazeRoyaleR:-1001688857780, MilionBlazeVip:-1001503352913}]
                        //Grupo starCrash
                        let planStarCrash = -1001651744972
                        // Banir o usuario dos grupos e adicionar o novo pelo invite link
                        for(let plan of userExist){
                            try { 
                                 bot.telegram.banChatMember(plans[0][plan.plan_name], plan.user_id)
                                 bot.telegram.banChatMember(planStarCrash, plan.user_id)
                            } catch (error) {
                                console.log(e)
                            }
                        }
                        // Atualizar 
                        for(let values in userExist){
                            await Users.findOneAndUpdate(values, {user_id:ctx.from.id})
                        }
                        console.log(groups)
                        for(let link of groups){
                            console.log(link)
                            bot.telegram.sendMessage(ctx.chat.id, link)
                        }
                        bot.telegram.sendMessage(ctx.chat.id, `Seja bem vindo novamente ${ctx.chat.first_name}!\r\nEsses são seus respectivos links de acesso aos grupos.\r\nCaso possua dúvidas, contate-nos.`)
                        await StatusUser.findOneAndUpdate({user_id:ctx.chat.id}, {finished:true})
                    }else if(messageToLower == "não" || messageToLower == "nao"){
                        finished = true
                        await StatusUser.findOneAndUpdate({user_id:ctx.chat.id}, {finished:true})
                        ctx.telegram.sendMessage(ctx.chat.id, "Certo! Agradeçemos pela confirmação.")
                    }else{
                        bot.telegram.sendMessage(ctx.chat.id, "Não compreendi sua resposta. Diga-me por favor deseja migrar sua conta? Responda:[SIM/NÃO]")
                    }
                    return
                }else{
                    bot.telegram.sendMessage(ctx.chat.id, "Você já terminou a verificação de seus dados.\r\nCaso precise de ajuda, contate-nos.")
                    return
                }
            }
        } catch (error) {
            
        }
        // ----------------------------------------.////////////---------------------------


        if(userStatus == null){
            if(ctx.message.text == "/start"){
                if(ctx.chat.type == "private"){
                    if(await verification.findOne() != null){
                        bot.telegram.sendMessage(ctx.from.id, `Olá ${ctx.from.first_name}. Bot atualmente em processo de verificação de assinaturas, volte novamente pelas 5:00 horas.`)
                        return
                    }
                    started = true;
                    await StatusUser.create({user_id:ctx.chat.id, started:true})
                    ctx.telegram.sendMessage(ctx.chat.id, `Olá ${ctx.chat.first_name}! Vamos iniciar sua verificação.`)
                    ctx.telegram.sendMessage(ctx.chat.id, `Diga-me por favor qual seu email como consta na compra do produto.`, {
                        reply_markup:{
                            force_reply:true
                        }
                    })
                }
                else{
                    return
                }
            }else{
                return
            }
        }
        else if(userStatus.finished == true){
                bot.telegram.sendMessage(ctx.chat.id, "Você já terminou a verificação de seus dados.\r\nCaso precise de ajuda, contate-nos.")
        }else if(userStatus.started == true){
            try{
                ctx.message.entities[0].type == "email"?(async()=>{


                    const Users = require("./models/Users")
                    //Verificar se o email está no banco de dados como verificado
                    let userExist;
                    try {
                       userExist = await Users.findOne({email_user:ctx.message.text})
                    } catch (e) {
                        console.log(e)
                    }
                    if(userExist != null){
                        emailSaved = ctx.message.text
                        existent = true

                        //--------------------------

                        let Users = require("./models/Users")
                        let userExist = await Users.find({user_email:emailSaved})
    
                        // Vem os links dos grupos, qualquer grupo possui um extra, no caso o StarCrashs ID DO GRUPO
                        let plans = [{MilionBlazeR:-1001651744972, BlazeRoyale:-1001651744972,BlazeRoyaleR:-1001651744972, MilionBlazeVip:-1001651744972}]
                         let plans_invite = {MilionBlazeR:"https://t.me/+o5-YgmuIYuQwZjRh", BlazeRoyale:"https://t.me/+3oPIfRRG8tgzN2Jh",BlazeRoyaleR:"https://t.me/+3oPIfRRG8tgzN2Jh", MilionBlazeVip:"https://t.me/+o5-YgmuIYuQwZjRh", StarCrash:"https://t.me/+sipUKfOsV-JlN2Vh"}
                        //Grupo starCrash
                        console.log(emailSaved)
                        let planStarCrash = "https://t.me/+sipUKfOsV-JlN2Vh"
                        console.log(userExist.length)
                        for(let i=0; i<userExist.length; i++){
                            let group = userExist[i].plan_name
                                groups.push(`${group}:`+plans_invite[group])
                                console.log(groups)
                                if(userExist.length == i+1){
                                        groups.push("StarCrashs: "+planStarCrash)
                                }
                        }
                        //-------------------------
                        await StatusUser.findOneAndRemove({user_id:ctx.chat.id})
                        await StatusUser.create({user_id:ctx.chat.id, existent:true})
                        bot.telegram.sendMessage(ctx.chat.id, `Verifiquei que você já possui confirmação em outra conta. Deseja migrar para esse novo telegram? Responda:[SIM]/[NÃO]`)
                        return
                    }else{
                        if(finding == true){
                            return
                        }
                        ctx.replyWithMarkdown(`Excelente.\r\nSeu email é: \`${ctx.message.text}\`.\r\nAguarde um momento, enquanto localizo seu email no banco de dados.`)
                        const verifyUser = require("./verifyUsers")
                        const email = ctx.message.text;
                        verifyUser(email, ctx.chat.id)
                    }
                })():(async()=>{
                    await StatusUser.findOneAndDelete({user_id:ctx.chat.id})
                    ctx.replyWithMarkdown(`Email invalido: \`${ctx.message.text}\`.\r\nPor favor, tente novamente digitando /start.`)

                })();
            }catch(e){
                await StatusUser.findOneAndUpdate({user_id:ctx.chat.id})
                ctx.replyWithMarkdown(`Email invalido: \`${ctx.message.text}\`.\r\nPor favor, tenten novamente digitando /start.`)

            }
        }
             
    }
})




function UpdateUser(userid){
    // Ir no banco de dados atualizar o id do user, e verificar quais grupos ele possui direito
    // Gerar links de acordo com seus respectivos grupos e finished passa pra true
}




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


