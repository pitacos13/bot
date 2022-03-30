const mongoose = require("mongoose")
let { Telegraf } = require("telegraf")
let bot = new Telegraf("5272128151:AAE5T62G6usrSk7iYyUwVcy-p5tX05Lewh8")
module.exports = async function removeUsersPending(){
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
}


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
    const {Telegraf} = require("telegraf")
    bot.telegram.banChatMember(plans[0][plan], user_id)
  }else{
    // Banir do grupo respectivo Verificaremos se o email do usuario ainda consta no Users, caso conste, mantenha ele no StarCrash 
    // Caso contrario, remova ele do StarCrashs [Localizar todos registro do usuario, e todos status, caso um esteja ativo, mantenha-o]
    bot.telegram.banChatMember(plans[0][plan], user_id) // Grupo
    bot.telegram.banChatMember(plans[0]["StarCrashs"], user_id) //StarCrashs
  }
  })():(()=>{
    try{
      bot.telegram.getChatMember(plans[0][plan], user_id)
      .then((e)=>{
      e.status == "kicked"?(()=>{
      bot.telegram.unbanChatMember(plans[0][plan], user_id) // Grupo
      bot.telegram.unbanChatMember(plans[0]["StarCrashs"], user_id) // StarCrash
      // Grupo 
      bot.telegram.createChatInviteLink(plans[0][plan]).then((link)=>{
        bot.telegram.sendMessage(user_id, link.invite_link)
      }).catch((c)=>{
        console.log(c)
      })
      // StarCrash
      bot.telegram.createChatInviteLink(plans[0]["StarCrashs"]).then((link)=>{
        bot.telegram.sendMessage(user_id, link.invite_link)
      }).catch((c)=>{
        console.log(c)
      })
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
  
  
