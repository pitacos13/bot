const telegraf = require("telegraf")
const mongoose = require("mongoose")
process.env.TZ = 'America/Sao_Paulo';
const axios = require("axios")
// Vai pegar o email que for passado na função, e verificar em todas tabelas.
let starCrashsLink = false;
module.exports = async function UpdateAndVerify(mail, user_id){
    let dateToPurchase;
    let planUserKey;
    const BlazeRoyale = require("./models/BlazeRoyale")
    const BlazeRoyaleR = require("./models/BlazeRoyaleR")
    const MilionBlazeR = require("./models/MilionBlazeR")
    const MilionBlazeVip = require("./models/MilionBlazeVip")
    const StarCrashs = require("./models/StarCrashs")
    const Users = require("./models/Users")
    const bot = require("./bot")
    const StatusUser = require("./models/StatusUser")
    let starCrashsLinkOne = require("./models/OneStarCrashLink")
    await starCrashsLinkOne.create({email_user:mail, starused:false})
  
    let links = [] // Array onde vai armazenar os grupos que o membro tem direito de acesso.
    let plans_key = [{BlazeRoyaleR:"prorv677", MilionBlazeR:"pro7rwod", BlazeRoyale:"pro5ydyq", StarCrashs:"proqg963", MilionBlazeVip:"proox1gw"}]
    let after = new Date(Date.now() - (86400000*2)).toLocaleDateString("pt-BR").split("/")
    let after_date = after[2]+"-"+after[1]+"-"+after[0]
    let now = new Date(Date.now() + (86400000*2)).toLocaleDateString("pt-BR").split("/")
    let now_date = now[2]+"-"+now[1]+"-"+now[0]
    async function One(){
      await BlazeRoyale.findOne({email_user:mail}) == null?(()=>{
        // Before initialize two, running verification in last page of api reference to plan.
        let url = `https://ev.braip.com/api/vendas?product_key=${plans_key[0]["BlazeRoyale"]}&date_min=${after_date} 11:15:00&date_max=${now_date} 11:15:00`;
        (()=>{
          const config = {
            url:url,
            method:"GET",
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
            }
        }
        axios(config)
        .then((r)=>{
            let lastUrl = r.data.last_page_url
            return toLastUrl1(lastUrl)
        })
        function toLastUrl1(url){
        const config = {
            url:url,
            method:"GET",
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
            }
        }
        axios(config)
        .then((r)=>{
            let result = r.data.data
            let approved = false;
            for(let i in result){
              result[i].client_email == mail && result[i].trans_status == "Pagamento Aprovado"?approved = true:""
            }
            approved == true?(async()=>{
              planUser = "pro5ydyq"
              dateToPurchase = result.trans_updatedate
              await Users.create({user_id:user_id, email_user:mail, plan_name:"BlazeRoyale", status_plan:true})
              let starCrashsLink = await starCrashsLinkOne.findOne({email_user:mail})
              if(starCrashsLink.starused == false){
                //Cria o link dos dois grupos e coloca starCrash como true
                await starCrashsLinkOne.findOneAndUpdate({email:mail}, {starused:true})
                bot.telegram.createChatInviteLink(-1001688857780).then((r)=>{ // Grupo
                  links.push("BlazeRoyale: "+r.invite_link)
                  bot.telegram.createChatInviteLink(-1001592231367).then((r)=>{ // StarScrashs
                    links.push("StarCrashs: "+r.invite_link)
                    return Two()
                  })
                })
              }else{
                bot.telegram.createChatInviteLink(-1001688857780).then((r)=>{
                  links.push("BlazeRoyale: "+r.invite_link)
                  return Two()
                })
              }
            })():Two()
        })
      }
  })();
})():(async()=>{
        await Users.create({user_id:user_id, email_user:mail, plan_name:"BlazeRoyale", status_plan:true})
        // Criar o link do StarCrash juntamente, e colocar true para não criar novamente, caso ele encontre um grupo do user
        let starCrashsLink = await starCrashsLinkOne.findOne({email_user:mail})
        if(starCrashsLink.starused == false){
          await starCrashsLinkOne.findOneAndUpdate({email:mail}, {starused:true})
          bot.telegram.createChatInviteLink(-1001688857780).then((r)=>{ // Grupo
            links.push("BlazeRoyale: "+r.invite_link)
            bot.telegram.createChatInviteLink(-1001592231367).then((r)=>{ // StarScrashs
              links.push("StarCrashs: "+r.invite_link)
              return Two()
            })
          })
        }else{
          bot.telegram.createChatInviteLink(-1001688857780).then((r)=>{
            links.push("BlazeRoyale: "+r.invite_link)
            return Two()
          })
        }
      })();
    }
    One()
    async function Two(){
      await BlazeRoyaleR.findOne({email_user:mail}) == null?(()=>{
        let url = `https://ev.braip.com/api/vendas?product_key=${plans_key[0]["BlazeRoyaleR"]}&date_min=${after_date} 11:15:00&date_max=${now_date} 11:15:00`;
        (()=>{
          const config = {
            url:url,
            method:"GET",
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
            }
        }
        axios(config)
        .then((r)=>{
            let lastUrl = r.data.last_page_url
            return toLastUrl2(lastUrl)
        })
        function toLastUrl2(url){
        const config = {
            url:url,
            method:"GET",
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
            }
        }
        axios(config)
        .then((r)=>{
            let result = r.data.data
            let approved = false;
            for(let i in result){
              result[i].client_email == mail && result[i].trans_status == "Pagamento Aprovado"?approved = true:""
            }
            approved == true?(async()=>{
              planUserKey = "prorv677"
              dateToPurchase = result.trans_updatedate
              await Users.create({user_id:user_id, email_user:mail, plan_name:"BlazeRoyaleR", status_plan:true})
              let starCrashsLink = await starCrashsLinkOne.findOne({email_user:mail})
              if(starCrashsLink.starused == false){
                await starCrashsLinkOne.findOneAndUpdate({email:mail}, {starused:true})
                bot.telegram.createChatInviteLink(-1001688857780).then((r)=>{ // Grupo
                  links.push("BlazeRoyaleR: "+r.invite_link)
                  bot.telegram.createChatInviteLink(-1001592231367).then((r)=>{ // StarScrashs
                    links.push("StarCrashs: "+r.invite_link)
                    return Three()
                  })
                })
              }else{
                bot.telegram.createChatInviteLink(-1001688857780).then((r)=>{
                  links.push("BlazeRoyaleR: "+r.invite_link)
                  return Three()
                })
              }
            })():Three()
        })
      }
  })();
      })():(async()=>{
        await Users.create({user_id:user_id, email_user:mail, plan_name:"BlazeRoyaleR",status_plan:true})
        let starCrashsLink = await starCrashsLinkOne.findOne({email_user:mail})
        if(starCrashsLink.starused == false){
          await starCrashsLinkOne.findOneAndUpdate({email:mail}, {starused:true})
          bot.telegram.createChatInviteLink(-1001688857780).then((r)=>{ // Grupo
            links.push("BlazeRoyaleR: "+r.invite_link)
            bot.telegram.createChatInviteLink(-1001592231367).then((r)=>{ // StarScrashs
              links.push("StarCrashs: "+r.invite_link)
              return Three()
            })
          })
        }else{
          bot.telegram.createChatInviteLink(-1001688857780).then((r)=>{
            links.push("BlazeRoyaleR: "+r.invite_link)
            return Three()
          })
        }
      })();
    }
    async function Three(){
      await MilionBlazeR.findOne({email_user:mail}) == null?(()=>{
        let url = `https://ev.braip.com/api/vendas?product_key=${plans_key[0]["MilionBlazeR"]}&date_min=${after_date} 11:15:00&date_max=${now_date} 11:15:00`;
        (()=>{
          const config = {
            url:url,
            method:"GET",
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
            }
        }
        axios(config)
        .then((r)=>{
            let lastUrl = r.data.last_page_url
            return toLastUrl3(lastUrl)
        })
        function toLastUrl3(url){
        const config = {
            url:url,
            method:"GET",
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
            }
        }
        axios(config)
        .then((r)=>{
            let result = r.data.data
            let approved = false;
            for(let i in result){
              result[i].client_email == mail && result[i].trans_status == "Pagamento Aprovado"?approved = true:""
            }
            approved == true?(async()=>{
              planUserKey = "pro7rwod"
              dateToPurchase = result.trans_updatedate
              await Users.create({user_id:user_id, email_user:mail, plan_name:"MilionBlazeR", status_plan:true})
              let starCrashsLink = await starCrashsLinkOne.findOne({email_user:mail})
              if(starCrashsLink.starused == false){
                
                await starCrashsLinkOne.findOneAndUpdate({email:mail}, {starused:true})
                bot.telegram.createChatInviteLink(-1001503352913).then((r)=>{ // Grupo
                  links.push("MilionBlazeR: "+r.invite_link)
                  bot.telegram.createChatInviteLink(-1001592231367).then((r)=>{ // StarScrashs
                    links.push("StarCrashs: "+r.invite_link)
                    return Four()
                  })
                })
              }else{
               
                bot.telegram.createChatInviteLink(-1001503352913).then((r)=>{
                  links.push("MilionBlazeR: "+r.invite_link)
                  return Four()
                })
              }
            })():Four()
        })
      }
  })();
      })():(async()=>{
        await Users.create({user_id:user_id, email_user:mail, plan_name:"MilionBlazeR", status_plan:true})
        let starCrashsLink = await starCrashsLinkOne.findOne({email_user:mail})
        if(starCrashsLink.starused == false){
          
          await starCrashsLinkOne.findOneAndUpdate({email:mail}, {starused:true})
          bot.telegram.createChatInviteLink(-1001503352913).then((r)=>{ // Grupo
            links.push("MilionBlazeR: "+r.invite_link)
            bot.telegram.createChatInviteLink(-1001592231367).then((r)=>{ // StarScrashs
              links.push("StarCrashs: "+r.invite_link)
              return Four()
            })
          })
        }else{
          
          bot.telegram.createChatInviteLink(-1001503352913).then((r)=>{
            links.push("MilionBlazeR: "+r.invite_link)
            return Four()
          })
        }
      })();
    }
    async function Four(){
      await MilionBlazeVip.findOne({email_user:mail}) == null?(()=>{
        let url = `https://ev.braip.com/api/vendas?product_key=${plans_key[0]["MilionBlazeVip"]}&date_min=${after_date} 11:15:00&date_max=${now_date} 11:15:00`;
        (()=>{
          const config = {
            url:url,
            method:"GET",
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
            }
        }
        axios(config)
        .then((r)=>{
            let lastUrl = r.data.last_page_url
            return toLastUrl4(lastUrl)
        })
        function toLastUrl4(url){
        const config = {
            url:url,
            method:"GET",
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
            }
        }
        axios(config)
        .then((r)=>{
            let result = r.data.data
            let approved = false;
            for(let i in result){
              result[i].client_email == mail && result[i].trans_status == "Pagamento Aprovado"?approved = true:""
            }
            approved == true?(async()=>{
              planUserKey = "proox1gw"
              dateToPurchase = result.trans_updatedate
              await Users.create({user_id:user_id, email_user:mail, plan_name:"MilionBlazeVip", status_plan:true})
              let starCrashsLink = await starCrashsLinkOne.findOne({email_user:mail})
              if(starCrashsLink.starused == false){
                await starCrashsLinkOne.findOneAndUpdate({email:mail}, {starused:true})
                bot.telegram.createChatInviteLink(-1001503352913).then((r)=>{ // Grupo
                  links.push("MilionBlazeVip: "+r.invite_link)
                  bot.telegram.createChatInviteLink(-1001592231367).then((r)=>{ // StarScrashs
                    links.push("StarCrashs: "+r.invite_link)
                    return Five()
                  })
                })
              }else{
                bot.telegram.createChatInviteLink(-1001503352913).then((r)=>{
                  links.push("MilionBlazeVip: "+r.invite_link)
                  return Five()
                })
              }
            })():Five()
        })
      }
  })();
      })():(async()=>{
        await Users.create({user_id:user_id, email_user:mail, plan_name:"MilionBlazeVip", status_plan:true})
        let starCrashsLink = await starCrashsLinkOne.findOne({email_user:mail})
        if(starCrashsLink.starused == false){
          await starCrashsLinkOne.findOneAndUpdate({email:mail}, {starused:true})
          bot.telegram.createChatInviteLink(-1001503352913).then((r)=>{ // Grupo
            links.push("MilionBlazeVip: "+r.invite_link)
            bot.telegram.createChatInviteLink(-1001592231367).then((r)=>{ // StarScrashs
              links.push("StarCrashs: "+r.invite_link)
              return Five()
            })
          })
        }else{
          bot.telegram.createChatInviteLink(-1001503352913).then((r)=>{
            links.push("MilionBlazeVip: "+r.invite_link)
            return Five()
          })
        }
      })();
    }


   async function Five(){
      (async()=>{
        await starCrashsLinkOne.findOneAndRemove({email_user:mail})
          if(links.length == 0){
           bot.telegram.sendMessage(user_id, `Nenhum registro localizado para o email ${mail}.\r\nTente novamente digitando /start ou contate-nos @dennycassius.`)
           await StatusUser.findOneAndDelete({user_id:user_id})
          }else{
            (async()=>{
              await StatusUser.findOneAndUpdate({user_id:user_id}, {finished:true})
              setTimeout(()=>{
                const datePayment = new Date(new Date(dateToPurchase).getTime()).toLocaleDateString()
                const dateToDay = new Date(new Date(Date.now()).getTime() - 604800000).toLocaleDateString() // Diminuir data por 7
                let userFinded;
                if(dateToPurchase >= dateToDay){
                  for(let link of links){
                    if(link.split(":")[0] == "StarCrashs"){
                      setTimeout(()=>{
                       let url = `https://ev.braip.com/api/vendas?product_key=${planUserKey}&date_min=${datePayment}&date_max=${now_date} 23:59:00`;
                       function verifyLastStatus(urlStoped){
                         if(urlStoped != null){
                           url = urlStoped
                         }
                        const axios = require("axios")
                        let config = {
                         url:url,
                         method:"GET",
                         headers: { 
                             'Content-Type': 'application/json', 
                             'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
                         }
                        }
                        axios(config).then((r)=>{
                          let dataUser = r.data.data
                          let nextPage = r.data.next_page_url
                          for(let values of dataUser){
                            if(values.client_email == mail && values.trans_status == "Pagamento Aprovado"){
                              bot.telegram.sendMessage(user_id, link)
                              userFinded = true
                            }
                          }
                          if(userFinded != true && nextPage != null){
                            verifyLastStatus(nextPage)
                          }else{
                            "Usuario não localizado."
                          }
                        }).catch((e)=>{
                          let lastUrl = url
                          if(e) return verifyLastStatus(lastUrl)
                        })
                       }verifyLastStatus()
                      }, 604800000)
                    }else{
                      bot.telegram.sendMessage(user_id, link)
                    }                   
                  }
                }else{
                  for(let link of links){
                    bot.telegram.sendMessage(user_id, link)
                  }
                }
              }, 1900)();
              setTimeout(() => {
                bot.telegram.sendMessage(user_id, "Esses são seus respectivos grupos e links.\r\nPara reiniciar a verificação, digite /reiniciar.\r\n\r\nQuaisquer dúdivas, contate-nos:@dennycassius")
              }, 2300);
            })();
          }
        })();
    }
}

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
