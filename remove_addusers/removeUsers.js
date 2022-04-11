const mongoose = require("mongoose")
let { Telegraf } = require("telegraf")
const path = require("path")
let bot = new Telegraf("5272128151:AAE5T62G6usrSk7iYyUwVcy-p5tX05Lewh8")
async function removeUsersPending(){
    // Vai pegar todos usuarios verificado// Ir no banco de dados que acabou de atualizar // Verificar
    // Se eles vão constar nas tabelas respectivas// Sim = True Não = False + Remove;
    const myUsers = require("../models/Users")
    let usersRecived = await myUsers.find()
    for(let i=0; i<usersRecived.length; i++){
      console.log(usersRecived.length)
      const userMail = usersRecived[i].email_user
      const userId = usersRecived[i].user_id
      const planName = usersRecived[i].plan_name
      let active = Boolean;
      try {
        const Plans = require(`../models/${planName}`)
        let find_User = await Plans.find({email_user:userMail})   
        if(`${find_User}` == []){
          // Remove
          active = false
          console.log("User not finded")
           kikeUserOrAdd(userMail, userId, active, planName)
        }else if(find_User == null){
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
      } catch (error) {
        // Remove
        console.log("User not finded")
        active = false 
        console.log("Plan not found.")
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
  const user = await myUsers.findOneAndUpdate({email_user:user_mail, plan_name:plan}, {status_plan:status}) // FindOne não, aqui é outro metodo.
  let plans = [{MilionBlazeR:-1001503352913, BlazeRoyale:-1001688857780,BlazeRoyaleR:-1001688857780, MilionBlazeVip:-1001503352913, StarCrash:-1001592231367}]
  let plans_invite = {MilionBlazeR:"https://t.me/+o5-YgmuIYuQwZjRh", BlazeRoyale:"https://t.me/+3oPIfRRG8tgzN2Jh",BlazeRoyaleR:"https://t.me/+3oPIfRRG8tgzN2Jh", MilionBlazeVip:"https://t.me/+o5-YgmuIYuQwZjRh", StarCrash:"https://t.me/+sipUKfOsV-JlN2Vh"}
  status == false?(async()=>{
    console.log(plans[0][plan])
    let oneStatusTrue = false;
    const userToFind = await myUsers.find({email_user:user_mail})
    for(let ele of userToFind){
      if(ele.status_plan == true){
        oneStatusTrue = true
      }else{
        
      }
  }
  if(oneStatusTrue == true){
    const {Telegraf} = require("telegraf")
    const bot = require("../bot")
    console.log(plans[0][plan])
    bot.telegram.banChatMember(plans[0][plan], user_id)
  }else{
    const {Telegraf} = require("telegraf")
    const bot = require("../bot")
    // Banir do grupo respectivo Verificaremos se o email do usuario ainda consta no Users, caso conste, mantenha ele no StarCrash 
    // Caso contrario, remova ele do StarCrashs [Localizar todos registro do usuario, e todos status, caso um esteja ativo, mantenha-o]
    bot.telegram.banChatMember(plans[0][plan], user_id) // Grupo
    bot.telegram.banChatMember(plans[0]["StarCrashs"], user_id) //StarCrashs
  }
  })():(()=>{
    const {Telegraf} = require("telegraf")
    const bot = require("../bot")
    try{
      bot.telegram.getChatMember(plans[0][plan], user_id)
      .then((e)=>{
      e.status == "kicked"?(()=>{
      bot.telegram.unbanChatMember(plans[0][plan], user_id) // Grupo
      bot.telegram.unbanChatMember(plans[0]["StarCrashs"], user_id) // StarCrash
      // Grupo 
      bot.telegram.sendMessage(user_id, plans_invite[plan])
      // StarCrash // Se o star Crash Já foi usado 1 vez, e o email for igual, evitamos enviar ele novamente
      bot.telegram.sendMessage(user_id, plans_invite["StarCrashs"])
        })():(()=>{
          throw("User not removed");
        })();
      }).catch((e)=>{
        console.log(e)
      })
    }catch(e){
      console.log("user not removed")
    }
  })();
}
module.exports = removeUsersPending
removeUsersPending();
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
  
