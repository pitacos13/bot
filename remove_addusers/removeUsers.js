const mongoose = require("mongoose")
let { Telegraf } = require("telegraf")
const path = require("path")
let bot = new Telegraf("5272128151:AAE5T62G6usrSk7iYyUwVcy-p5tX05Lewh8")
let chatId;
let plans_invite = {MilionBlazeR:"https://t.me/+o5-YgmuIYuQwZjRh", BlazeRoyale:"https://t.me/+3oPIfRRG8tgzN2Jh",BlazeRoyaleR:"https://t.me/+3oPIfRRG8tgzN2Jh", MilionBlazeVip:"https://t.me/+o5-YgmuIYuQwZjRh", StarCrash:"https://t.me/+sipUKfOsV-JlN2Vh"}
let planInvite;
async function removeUsersPending(){
     const bot = require("../bot")
     const myUsers = require("../models/Users")
    let usersRecived = await myUsers.find()
    for(let i=0; i<usersRecived.length; i++){
      console.log(i)
      const userMail = usersRecived[i].email_user
      const userId = usersRecived[i].user_id
      const planName = usersRecived[i].plan_name
      if(planName == "MilionBlazeR"){
          chatId = -1001503352913
           planInvite = "https://t.me/+o5-YgmuIYuQwZjRh"
      }else if(planName == "BlazeRoyale"){
          chatId = -1001688857780
          planInvite = "https://t.me/+3oPIfRRG8tgzN2Jh"
      }else if(planName == "BlazeRoyaleR"){
          chatId = -1001688857780
           planInvite = "https://t.me/+3oPIfRRG8tgzN2Jh"
      }else if(planName == "MilionBlazeVip"){
          chatId = -1001503352913
           planInvite = "https://t.me/+o5-YgmuIYuQwZjRh"
      }
      let active = Boolean;
       const Plans = require(`../models/${planName}`)
        let find_User = await Plans.findOne({email_user:userMail})   
       if(find_User == null){
          //Remove
          active = false
          console.log("User not finded")
           kikeUserOrAdd(userMail, userId, active, planName)
        }
        else{
          // Encontrou
          active = true
           kikeUserOrAdd(userMail, userId, active, planName)
        }
    }
    const path = require("path")
    let status = require(path.join(__dirname, "../models/Verification"))
    await status.findOneAndRemove({running:true})
}

let emailsToSave = [] // Salvar emails e evitar duplicidade do starcrash

async function kikeUserOrAdd(user_mail, user_id, status, plan){
  ///// VAI DESBANIR O MEMBRO NO RESPECTIVO PLANO E ENVIAR UM CONVITE DE ACORDO COM O PLANO E GRUPO
  // VAMOS USAR UM FOR PARA PEGAR O NOME DO PLANO E O EMAIL, PARA CONSEGUIRMOS CAPTALO NO GP
  let myUsers;
  try{
    myUsers = require("../models/Users")
  }catch(e){
    myUsers = require("./models/Users")
  }
  const user = await myUsers.findOneAndUpdate({email_user:user_mail, plan_name:plan}, {status_plan:status}) // FindOne n??o, aqui ?? outro metodo.
  status == false?(async()=>{
    let oneStatusTrue = false;
    const userToFind = await myUsers.find({email_user:user_mail})
    for(let ele of userToFind){
      if(ele.status_plan == true){
        oneStatusTrue = true
      }else{
        
      }
  }
  if(oneStatusTrue == true){
    try{
       bot.telegram.banChatMember(chatId, user_id)
    }catch(e){
       "NOT EXIST"
    }
  }else{
    // Banir do grupo respectivo Verificaremos se o email do usuario ainda consta no Users, caso conste, mantenha ele no StarCrash 
    // Caso contrario, remova ele do StarCrashs [Localizar todos registro do usuario, e todos status, caso um esteja ativo, mantenha-o]
     try{
        bot.telegram.banChatMember(chatId, user_id) // Grupo
     }catch(e){
       "NOT EXIST"
     }
     try{
        bot.telegram.banChatMember(chatId, user_id) //StarCrashs
     }catch(e){
       "NOT EXIST"
     }
  }
  })():(()=>{
    try{
      bot.telegram.unbanChatMember(chatId, user_id) // Grupo
    }catch(e){
      "NOT"
    }
    try {
      bot.telegram.unbanChatMember(-1001592231367, user_id) // StarCrash
    } catch (error) {
      "NOT"
    }
    try {
      bot.telegram.sendMessage(user_id, "Assinaturas atualizadas. Caso tenha efetuado novamente o pagamento, tente entrar no grupo novamente ou digite /reiniciar.")
    } catch (error) {
      "NOT"
    }
  })();
}
module.exports = removeUsersPending;
(async()=>{
    let user = "botTelegram"
    let password = "bottelegram2022"
    mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.e60ei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(()=>{
      console.log("Connected with sucess")
    }).catch((e)=>{
      console.log(e)
    })
  })()
  
