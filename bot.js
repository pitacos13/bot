const {Telegraf} = require("telegraf")
const bot = new Telegraf("5272128151:AAE5T62G6usrSk7iYyUwVcy-p5tX05Lewh8")
module.exports = bot;
process.env.TZ = 'America/Sao_Paulo';
const StatusUser = require("./models/StatusUser")
const mongoose = require("mongoose")

const express = require("express")
const app = express()

async function removeBug(){
  let allUser = await StatusUser.find()
  for(let user of allUser){
    try{
      if(user.finished == false){
        await StatusUser.findOneAndRemove({user_id:user.user_id})
      }
    }catch(e){
      await StatusUser.findOneAndRemove({user_id:user.user_id})
    }
  }
}
process.env.TZ = 'America/Sao_Paulo';
const verification = require("./models/Verification")
setInterval(async()=>{
  if(new Date(Date.now()).toLocaleTimeString("pt-BR") == "03:00:50"){
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
    const UsersOfMone = require("./models/UsersStatusMone")
    let memberFind = await Users.findOne({user_id:newMemberId})
    let memberFindMone = await UsersOfMone.findOne({user_id:newMemberId, finished:true})
    console.log(memberFindMone) 
    console.log(memberFind)
    if(memberFindMone != null){
      console.log("user Located")
    }
    else if(memberFind == null || `${memberFind}` == []){
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
           try{
             await bot.telegram.sendMessage(newMemberId, "Olá! Percebi que você tentou entrar no grupo e foi banido. Caso esteja utilizando um link antigo, talvez seu cadastro não seja mais existente.\r\n\Tente novamente digitando /start ou contate-nos.")
           }catch(e){
            "-------"
             console.log(e)
           }
           bot.on("left_chat_member", (ctx)=>{
                   bot.telegram.deleteMessage(msg.chat.id, msg.message.message_id)
           })
       }
    }else if(memberFind != null || `${memberFind}` != []){
       let groupsOfUsers = [-1001688857780, -1001503352913, -1001592231367]
       let groupsName = {"MilionBlazeVip":groupsOfUsers[1], "MilionBlazeR":groupsOfUsers[1], "BlazeRoyaleR":groupsOfUsers[0], "BlazeRoyale":groupsOfUsers[0]}
       if(memberFind.plan_name == "MilionBlazeVip" || memberFind.plan_name == "MilionBlazeR"){
        if(msg.chat.id != groupsName[memberFind.plan_name] && msg.chat.id != groupsOfUsers[2]){
          bot.telegram.banChatMember(msg.chat.id, msg.from.id)
        }
       }else if(memberFind.plan_name == "BlazeRoyaleR" || memberFind.plan_name == "BlazeRoyale"){
        if(msg.chat.id != groupsName[memberFind.plan_name] && msg.chat.id != groupsOfUsers[2]){
          bot.telegram.banChatMember(msg.chat.id, msg.from.id)
        }
      }
       msg = null
       newMemberId = null
       newMemberUsername = null
       memberFind = null
    }
});
bot.on("left_chat_member", (ctx)=>{
   bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
})

let emailUser;
let keyUsed;
const Users = require("./models/Users")
const UsersKey = require("./models/UsersKey")
bot.on("message", async(ctx)=>{
      let UserKey = await UsersKey.findOne({user_id:ctx.from.id})  
       if(ctx.chat.type == "private"){
        let groupsExis = [-1001503352913, -1001688857780, -1001688857780, -1001503352913, -1001592231367]
        //============================= Adicao de users permitido =========================///////
        if(ctx.message.text == "massachusetts"){
            if(await UsersKey.findOne({user_id:ctx.from.id}) != null){
              await UsersKey.findOneAndUpdate({user_id:ctx.from.id}, {keyused:true})
            }else{
              await UsersKey.create({user_id:ctx.from.id, keyused:true})
            }
            bot.telegram.sendMessage(ctx.chat.id, "Palavra chave utilizada.")
            console.log(ctx)
            return
        }
      if(await UsersKey.findOne({user_id:ctx.from.id}) != null){
        if(UserKey.keyused == true){
            const UsersAllowed = require("./models/UsersAllowed")
            let userToAdd = ctx.message.text
            let typeUser = typeof(userToAdd)
            console.log(typeUser)
            if(typeUser != "number"){
                await UsersAllowed.create({user_name:userToAdd})
                bot.telegram.sendMessage(ctx.chat.id, "Usuário cadastrado com sucesso.")
                await UsersKey.findOneAndUpdate({user_id:ctx.from.id}, {keyused:false})  
            }else if(typeUser == "number"){
                await UsersAllowed.create({user_id:userToAdd})
                bot.telegram.sendMessage(ctx.chat.id, "Usuário cadastrado com sucesso.")
                await UsersKey.findOneAndUpdate({user_id:ctx.from.id}, {keyused:false})  
            }else{
                bot.telegram.sendMessage(ctx.chat.id,"Não consegui identificar o tipo. Por favor, me informe novamente por favor.")
            }
            return                  
        }
      }
         return
        //==============================================================================///////
        if(typeof(ctx.message.text) != "string"){
          return
        }
         if(ctx.message.text.toLowerCase() == "/reiniciar"){
            const User = require("./models/Users")
            //-- Verificar na db pertencente ao usuario, verificar se já foi registrado, verificar se não foi registrado e se inicializou.
            let userExist = await StatusUser.findOne({user_id:ctx.from.id})
            if(userExist == null){
                bot.telegram.sendMessage(ctx.from.id, "Você ainda não inicializou o cadastro. Por favor, digite /start para iniciar.")
            }else{
                await User.findOneAndRemove({user_id:ctx.from.id})
                // Apagar o cadastro e permiti-lo refazer, removendo ele da lista de banidos de todos grupos.
                await StatusUser.findOneAndRemove({user_id:ctx.from.id})
                //--Unban
                let groups = [-1001592231367, -1001688857780, -1001503352913]
                for(let group of groups){
                    try {
                        await bot.telegram.unbanChatMember(group, ctx.from.id)
                    } catch (error) {
                        console.log("Member reinitialized but not banned.")
                    }
                }
                bot.telegram.sendMessage(ctx.from.id, "Cadastro reinicializado! Digite /start para cadastrar-se novamente.", {reply_markup:{force_reply:true}})
            }
            return
        }else{
        if(await verification.findOne() != null){
            bot.telegram.sendMessage(ctx.from.id, `Olá ${ctx.from.first_name}. Bot atualmente em processo de verificação de assinaturas, volte mais tarde pelas 5 horas.`)
            return
        }
        let findUser = await Users.findOne({user_id:ctx.from.id})
        let statusUser = await StatusUser.findOne({user_id:ctx.from.id})
        if(statusUser == null){
            await StatusUser.create({user_id:ctx.from.id, started:false, finished:false, finding:false, existent:false, starcrashUsed:false})
        }
         if(statusUser.finished == true){
            bot.telegram.sendMessage(ctx.from.id, "Cadastro já finalizado! Caso possua algum problema com seu cadastro, digite /reiniciar para reiniciar seu cadastro ou contate-nos.")
            return
         }
                  statusUser = await StatusUser.findOne({user_id:ctx.from.id})
        if(ctx.message.text.toLowerCase() == "/start" && findUser == null && statusUser.started == false && statusUser.finished == false && statusUser.existent == false && statusUser.finding == false){
            try {
                for(let group of groupsExis){
                    await bot.telegram.unbanChatMember(ctx.from.id, group)
                }
            } catch (error) {
                console.log("Member not banned")
            }
            bot.telegram.sendMessage(ctx.chat.id, `Olá Blaze. Vamos iniciar seu cadastro! Primeiro diga-me qual seu email utilizado ao fazer a compra.\r\n\r\nObs: digite seu email exatamente como consta na compra do produto, caso possua qualquer problema durante o cadastro digite /reiniciar.`, {reply_markup:{force_reply:true}})
            await StatusUser.findOneAndUpdate({user_id:ctx.from.id}, {started:true, finished:false, finding:false, existent:false})
        }else if(ctx.message.text.toLowerCase() == "/start" && findUser == null && statusUser.started == true && statusUser.finished == false && statusUser.existent == false && statusUser.finding == false){
          bot.telegram.sendMessage(ctx.from.id, "Por favor, diga-me qual seu email como consta na compra do produto. Ou caso esteja tendo algum problema digite o comando /reiniciar para começarmos todo o processo novamente.", {reply_markup:{force_reply:true}})
          return
        }
        else if(ctx.message.text.toLowerCase() != "/start" && findUser == null && statusUser.started == false && statusUser.finished == false && statusUser.existent == false && statusUser.finding == false){
            bot.telegram.sendMessage(ctx.from.id, "Para inicializar seu cadastro digite /start.")
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
                let usersMoneti = require("./models/UsersStatusMone")
                let findInMoneti = await usersMoneti.findOne({email:ctx.message.text})
                if(findInMoneti != null){
                  bot.telegram.sendMessage(ctx.from.id, "Vimos que o seu email ja consta em nosso banco de dados pois você ja comprou nosso produto em outra ocasião. Caso tenha dificuldades entre em contato conosco através de nossas redes sociais ou digite /start para tentar novamente.")
                  await StatusUser.findOneAndUpdate({user_id:ctx.from.id}, {started:false, finished:false, finding:false, existent:false})
                  return
                }else{
                  bot.telegram.sendMessage(ctx.from.id, `Execelente, seu email é ${ctx.message.text}. Aguarde um momento enquanto localizo em nosso registro.`)
                  verifyEmail(ctx.message.text, ctx.from.id)
                  await StatusUser.findOneAndUpdate({user_id:ctx.from.id}, {started:true, finished:false, finding:true, existent:false})
                }
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
                try{
                  ctx.replyWithMarkdown(`Migração realizada com sucesso! Seus respectivos grupos são:\r\n\`${groups.plan_name}\` - ${plans_invite[groups.plan_name]}\r\n\`StarCrashs\` - ${plans_invite["StarCrash"]}`)
                }catch(e){
                console.log(e)
                }
            }else if(ctx.message.text.toLowerCase() == "nao" || ctx.message.text.toLowerCase() == "não"){
                bot.telegram.sendMessage(ctx.from.id, "Certo! Migração cancelada com sucesso. Caso queira tentar novamente, digite /start")
                await StatusUser.findOneAndUpdate({user_id:ctx.from.id}, {started:false, finding:false, existent:false, finished:false})
            }else{
                bot.telegram.sendMessage(ctx.from.id, "Não compreendi sua resposta! Digite Sim ou Não.")
            }
        }
    }  
}
})





async function verifyEmail(email, userid) {
  const axios = require("axios")
  const BlazeRoyale = require("./models/BlazeRoyale")
  const BlazeRoyaleR = require("./models/BlazeRoyaleR")
  const MilionBlazeR = require("./models/MilionBlazeR")
  const MilionBlazeVip = require("./models/MilionBlazeVip")
  const StatusUsers = require("./models/StatusUser")
  const Users = require("./models/Users")
    let findBla, findBlaR, findMill, findMillV;
    const links = {MilionBlazeR:"https://t.me/+o5-YgmuIYuQwZjRh", BlazeRoyale:"https://t.me/+3oPIfRRG8tgzN2Jh",BlazeRoyaleR:"https://t.me/+3oPIfRRG8tgzN2Jh", MilionBlazeVip:"https://t.me/+o5-YgmuIYuQwZjRh", StarCrash:"https://t.me/+sipUKfOsV-JlN2Vh"}
    let plansId = {BlazeRoyaleR:"prorv677", MilionBlazeR:"pro7rwod", BlazeRoyale:"pro5ydyq", MilionBlazeVip:"proox1gw"}
    let findedInBlaze;
    let findedInBlazeR;
    let findedInMillionBlazeR;
    let findedInMillionVip;
    
        let findInBlaze = await BlazeRoyale.find()
        let toLowerBlaze = findInBlaze.filter(value => value.email_user.toLowerCase() == email.toLowerCase())
        email = toLowerBlaze != null && `${toLowerBlaze}` != []?toLowerBlaze[0].email_user:email
        findedInBlaze = toLowerBlaze[0]


        let findInBlazeR = await BlazeRoyaleR.find()
        let toLowerBlazeR = findInBlazeR.filter(value => value.email_user.toLowerCase() == email.toLowerCase())
        email = toLowerBlazeR[0] != null && `${toLowerBlazeR}` != []?toLowerBlazeR[0].email_user:email
        findedInBlazeR = toLowerBlazeR[0]



        let findInMillionR = await MilionBlazeR.find()
        let toLowerMillionR = findInMillionR.filter(value => value.email_user.toLowerCase() == email.toLowerCase())
        email = toLowerMillionR[0] != null && `${toLowerMillionR}` != []?toLowerMillionR[0].email_user:email
        findedInMillionBlazeR = toLowerMillionR[0]



        let findInMillionVip = await BlazeRoyale.find()
        let toLowerMillionVip = findInMillionVip.filter(value => value.email_user.toLowerCase() == email.toLowerCase())
        email = toLowerMillionVip[0] != null && `${toLowerMillionVip}` != []?toLowerMillionVip[0].email_user:email
        findedInMillionVip = toLowerMillionVip[0]

    if(findedInBlaze != null){      
        findBla = true
        setTimeout(async()=>{
            await bot.telegram.sendMessage(userid, `Blaze Royale: ${links["BlazeRoyale"]}`)
        }, 10000)
    }else if(await BlazeRoyale.findOne({email_user:email}) != null){
        findBla = true
        setTimeout(async()=>{
            await bot.telegram.sendMessage(userid, `Blaze Royale: ${links["BlazeRoyale"]}`)
        }, 10000)
    }
  //-- Metodo 2
    else if(findedInBlazeR != null && findBla != true){
        setTimeout(async()=>{
            await bot.telegram.sendMessage(userid, `Blaze Royale-R: ${links["BlazeRoyaleR"]}`)
        }, 10000)
        findBlaR = true
    }else if(await BlazeRoyaleR.findOne({email_user:email}) != null){
        findBlaR = true
        setTimeout(async()=>{
            await bot.telegram.sendMessage(userid, `Blaze Royale-R: ${links["BlazeRoyaleR"]}`)
        }, 10000)
    }
    //-- Metodo 2
    else if(findedInMillionBlazeR != null){
        findMill = true
        setTimeout(async()=>{
            await bot.telegram.sendMessage(userid, `Million Blaze-R: ${links["MilionBlazeR"]}`)
        }, 10000)
    }else if(await MilionBlazeR.findOne({email_user:email}) != null){
              findMill = true
        setTimeout(async()=>{
            await bot.telegram.sendMessage(userid, `Million Blaze-R: ${links["MilionBlazeR"]}`)
        }, 10000)
    }
  //-- Metodo 2
    else if(findedInMillionVip != null && findMill != true){
        findMillV = true
        setTimeout(async()=>{
            await bot.telegram.sendMessage(userid, `Million Blaze-Vip: ${links["MilionBlazeVip"]}`)
        }, 10000)
    }else if(await MilionBlazeVip.findOne({email_user:email}) != null){
                findMillV = true
        setTimeout(async()=>{
            await bot.telegram.sendMessage(userid, `Million Blaze-Vip: ${links["MilionBlazeVip"]}`)
        }, 10000)
    }
  // Metodo 2
    if(findBla == true || findBlaR == true || findMill == true || findMillV == true){
        // Verificar data de compra --
         let groups = [-1001592231367, -1001688857780, -1001503352913]
         for(let group of groups){
            try {
              await bot.telegram.unbanChatMember(group, userid)
            } catch (error) {
               console.log("Member reinitialized but not banned.")
           }
        }
        let planName = findBla == true?"BlazeRoyale":findBlaR == true?"BlazeRoyaleR":findMill == true?"MilionBlazeR":findMillV == true?"MilionBlazeVip":""
        const planFinded = require(`./models/${planName}`)
        let findUser = await planFinded.findOne({email:email})
        let datePayment = findUser.date_payment
        let datePaymentTime = new Date(datePayment).getTime()
        let dateNowTime = Date.now() - 604800000
        //--
        let datePayLocale = new Date(datePayment).toLocaleDateString("pt-BR").split("/")
        let datePayLocaleString = datePayLocale[2]+"-"+datePayLocale[1]+"-"+datePayLocale[0]
        //-------
        if(datePaymentTime >= dateNowTime){
            await StatusUsers.findOneAndUpdate({user_id:userid}, {finished:true})
            await Users.create({user_id:userid, email_user:email, plan_name:planName, status_plan:true})
            bot.telegram.sendMessage(userid, "Esses são seus respectivos grupos e links e em 7 dias eu vou lhe enviar automaticamente o link do seu grupo BÔNUS, o STAR CRASH VIP.")
            setTimeout(async()=>{
                let dateNowLocale = new Date(Date.now()).toLocaleDateString("pt-BR").split("/") 
                let dateNowLocaleString = dateNowLocale[2]+"-"+dateNowLocale[1]+"-"+dateNowLocale[0]
                let url_verify = `https://ev.braip.com/api/vendas?product_key=${plansId[planName]}&date_min=${datePayLocaleString} 00:00:00&date_max=${dateNowLocaleString} 23:59:59`
                let finded = false;
                async function verifyInUrl(url){
                    if(url != null){
                        url = url
                    }else{
                        url = url_verify
                    }
                    axios({
                        url:url,
                        method:"GET",
                        headers:{
                            "Content-Type": "application/json", 
                            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY"            
                        }
                    }).then(async(r)=>{
                        let userMail = email
                        const responseValues = r.data.data
                        let nextUrl = r.data.next_page_url
                        for(let values of responseValues){
                            let emailsFinded = values.client_email
                            let transStatus = values.trans_status
                            if(emailsFinded == userMail && transStatus == "Pagamento Aprovado"){
                                finded = true
                                bot.telegram.sendMessage(userid, "Aqui está seu link STAR CRASH VIP: https://t.me/+sipUKfOsV-JlN2Vh")
                            }
                        }
                        if(finded == false && nextUrl != null){
                            return verifyInUrl(nextUrl)
                        }else{
                            return
                        }
                    }).catch((r)=>{
                        if(r) return verifyInUrl(url)
                    })
                }
                verifyInUrl()
            }, 604800000)
        }else{
            await StatusUsers.findOneAndUpdate({user_id:userid}, {finished:true})
            await Users.create({user_id:userid, email_user:email.toLowerCase(), plan_name:planName, status_plan:true})
            setTimeout(async()=>{
              await bot.telegram.sendMessage(userid, "Star Crash: https://t.me/+sipUKfOsV-JlN2Vh")
              await bot.telegram.sendMessage(userid, "Esses são seus respectivos links/Grupos. Quaisquer dúvidas, contate-nos.")
            },10000)
        }
    }else{
        // Verificar nas url
        let dateNowLocale = new Date(Date.now()).toLocaleDateString("pt-BR").split("/") 
        let dateNowLocaleString = dateNowLocale[2]+"-"+dateNowLocale[1]+"-"+dateNowLocale[0]
        let urls = [`https://ev.braip.com/api/vendas?product_key=pro5ydyq&date_min=${dateNowLocaleString} 00:00:00&date_max=${dateNowLocaleString} 23:59:59`, `https://ev.braip.com/api/vendas?product_key=prorv677&date_min=${dateNowLocaleString} 00:00:00&date_max=${dateNowLocaleString} 23:59:59`, `https://ev.braip.com/api/vendas?product_key=pro7rwod&date_min=${dateNowLocaleString} 00:00:00&date_max=${dateNowLocaleString} 23:59:59`, `https://ev.braip.com/api/vendas?product_key=proox1gw&date_min=${dateNowLocaleString} 00:00:00&date_max=${dateNowLocaleString} 23:59:59`]
        let planNameUrl = ["BlazeRoyale", "BlazeRoyaleR", "MilionBlazeR", "MilionBlazeVip"]
        let i = 0;
        let located = false;
        findInUrl(urls[i])
        function findInUrl(url) {
            axios({
                url:url,
                method:"GET",
                headers:{
                    "Content-Type": "application/json", 
                    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY"            
                }
            }).then(async(r)=>{
                let responseData = r.data.data
                let nextUrl = r.data.next_page_url
                let userEmail = email
                let plan_name = planNameUrl[i]
                for(let value of responseData){
                    let planStatus = value.trans_status
                    let emailFinded = value.client_email
                    let datePayment = value.trans_updatedate
                    if(emailFinded.toLowerCase() == userEmail.toLowerCase() && planStatus == "Pagamento Aprovado"){
                        located = true
                         let groups = [-1001592231367, -1001688857780, -1001503352913]
                         for(let group of groups){
                          try {
                            await bot.telegram.unbanChatMember(group, userid)
                          } catch (error) {
                             console.log("Member reinitialized but not banned.")
                         }
                        }
                        await StatusUsers.findOneAndUpdate({user_id:userid}, {finished:true})
                        await Users.create({user_id:userid, email_user:emailFinded, plan_name:plan_name, status_plan:true})
                        setTimeout(()=>{
                        bot.telegram.sendMessage(userid, `${plan_name}: ${links[plan_name]}.`)
                        bot.telegram.sendMessage(userid, "Esses são seus respectivos grupos e links e em 7 dias eu vou lhe enviar automaticamente o link do seu grupo BÔNUS, o STAR CRASH VIP.")
                        }, 5000)
                        setTimeout(async()=>{
                            let dateNowLocale = new Date(Date.now()).toLocaleDateString("pt-BR").split("/") 
                            let dateNowLocaleString = dateNowLocale[2]+"-"+dateNowLocale[1]+"-"+dateNowLocale[0]
                            let urlToPlan = `https://ev.braip.com/api/vendas?product_key=${plansId[planNameUrl[i]]}&date_min=${datePayment}&date_max=${dateNowLocaleString} 23:59:59`
                            findStatus(urlToPlan)
                            let finded = false;
                            async function findStatus(url){
                                axios({
                                    url:url,
                                    method:"GET",
                                    headers:{
                                        "Content-Type": "application/json", 
                                        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY"            
                                    }
                                }).then(async(r)=>{
                                    let responseValues = r.data.data
                                    let next_url = r.data.next_page_url
                                    let user_email = email
                                    for(let value of responseValues){
                                        let planStatus = value.trans_status
                                        let planEmail = value.client_email
                                        if(user_email.toLowerCase() == planEmail.toLowerCase() && planStatus == "Pagamento Aprovado"){
                                            finded = true
                                            bot.telegram.sendMessage(userid, "Aqui está seu grupo Star Crash VIP: https://t.me/+sipUKfOsV-JlN2Vh")
                                        }
                                    }
                                    if(finded == false && next_url == true){
                                        findStatus(next_url)
                                    }else{
                                        return
                                    }
                                }).catch((r)=>{
                                    if(r) return findStatus(url)
                                    console.log(r)
                                })
                            }
                        }, 604800000)
                    }
                }
                if(nextUrl != null && located == false){
                    return findInUrl(nextUrl)
                }else if(located == false){
                    // ---- Proxima url -- //
                    i++
                    if(urls[i] == null || urls[i] == undefined){
                        bot.telegram.sendMessage(userid, "Não localizei nenhum registro em nosso banco de dados. Nos faça um favor clique neste link abaixo e fale com o nosso segundo BOT pois ele vai tentar localizar de outra maneira.\r\n\r\n@ClubMilionBot2_bot\r\n\r\nCaso ele não localize, verifique se esta digitando o email corretamente ou digite /START para reiniciar a verificação.\r\n\r\nEm último caso entre em contato com nosso suporte através das nossas redes sociais.")
                        await StatusUsers.findOneAndUpdate({user_id:userid}, {started:false, finding:false, finished:false, existent:false})
                        return
                    }else{
                        findInUrl(urls[i])
                    }
                }else{
                    return
                }
            }).catch((error)=>{
                console.log(error)
            })
        }
    }
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

