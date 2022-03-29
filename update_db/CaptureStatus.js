const mongoose = require("mongoose")

var axios = require('axios');
const fs = require("fs");
const bot = require("../bot");
process.env.TZ = 'America/Sao_Paulo';
module.exports = function RemoveOrAdd(){
  const RemoveUsers = require("../remove_addusers/removeUsers")

    fs.readFile("./update_db/date.txt", "utf-8", (err,data)=>{
        if(err) return console.log(err)
        //Arm ---->
        console.log(data)
        let date_now = new Date(Date.now() + 86400000).toLocaleDateString("pt-BR")
        let until = JSON.parse(data).date_until.split("/")
         // Ano - Mes - Dia / Formato do javascript
        let datas = new Date(until[2]+"-"+until[1]+"-"+until[0]).getTime() + (86400000*2)
        let dateUntil = new Date(datas).toLocaleDateString("pt-BR")
        // <-----
        fs.writeFile("./update_db/date.txt", JSON.stringify({date_today:date_now, date_until:dateUntil}), (err, data)=>{
            if(err) return console.log(err)
            console.log("Sucess")
            fs.readFile("./update_db/date.txt", "utf-8", (err,data)=>{
                if(err) return console.log(err)
                let data_json = JSON.parse(data)
                // Year - month - day
                let date_today = data_json.date_today.split("/")[2]+"-"+data_json.date_today.split("/")[1]+"-"+data_json.date_today.split("/")[0]
                let date_before = data_json.date_until.split("/")[2]+"-"+data_json.date_until.split("/")[1]+"-"+data_json.date_until.split("/")[0]
                /////// ---------- Functions ---------//////
                
// Criar um metodo para aumentar 1 dia a cada lopp sem substituir o date.txt, de forma que ele adicione 
let url_milionBlazeVip = `https://ev.braip.com/api/vendas?product_key=proox1gw&date_min=${date_before} 11:15:00&date_max=${date_today} 11:15:00`
function VerifyGroupMilionBlazeVip(){
  console.log(url_milionBlazeVip)
    var config = {
        method: 'get',
        url: url_milionBlazeVip,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
        }
      };
      
      axios(config)
      .then(function (response) {
        let res = JSON.stringify(response.data.data)
        let res_Tonextpage = JSON.parse(JSON.stringify(response.data))
        let resToJson = JSON.parse(res)
        for(let i=0; i<resToJson.length;i++){
            const BlazeVip = require("./models/MilionBlazeVip")
            let email_user = resToJson[i].client_email
            let plan_id = "proox1gw";
            let plan_status = resToJson[i].trans_status == "Pagamento Aprovado"?SaveDataRecived(email_user, resToJson[i].trans_status, plan_id, BlazeVip, url_milionBlazeVip):"";
        }
        try{
            res_Tonextpage.next_page_url == null?(()=>{
                // Terminated - Next -->
                VerifyGroupblazeRoyale()
            })():(()=>{
                url_milionBlazeVip = res_Tonextpage.next_page_url;
                return VerifyGroupMilionBlazeVip()
            })()
        }catch(e){
            console.log(e)
        }
      })
      .catch(function (error) {
        return VerifyGroupMilionBlazeVip()
      });
}
VerifyGroupMilionBlazeVip()




let url_blazeRoyale = `https://ev.braip.com/api/vendas?product_key=pro5ydyq&date_min=${date_before} 11:15:00&date_max=${date_today} 11:15:00`
function VerifyGroupblazeRoyale(){
    var config = {
        method: 'get',
        url: url_blazeRoyale,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
        }
      };
      
      axios(config)
      .then(function (response) {
        const BlazeRoyale = require("./models/BlazeRoyale")
        let res = JSON.stringify(response.data.data)
        let res_Tonextpage = JSON.parse(JSON.stringify(response.data))
        let resToJson = JSON.parse(res)
        for(let i=0; i<resToJson.length;i++){
          let email_user = resToJson[i].client_email
          let plan_id = "pro5ydyq"
          let plan_status = resToJson[i].trans_status == "Pagamento Aprovado"?SaveDataRecived(email_user, resToJson[i].trans_status, plan_id, BlazeRoyale, url_blazeRoyale):"";
        }
        try{
            res_Tonextpage.next_page_url == null?(()=>{
                // Terminated - Next -->
                VerifyGroupBlazeRoyaleR()
            })():(()=>{
                url_blazeRoyale = res_Tonextpage.next_page_url;
                return VerifyGroupblazeRoyale()
            })()
        }catch(e){
            console.log(e)
        }
      })
      .catch(function (error) {
        return VerifyGroupblazeRoyale()
      });
}

/////-----------

let url_blazeRoyaleR = `https://ev.braip.com/api/vendas?product_key=prorv677&date_min=${date_before} 11:15:00&date_max=${date_today} 11:15:00`
function VerifyGroupBlazeRoyaleR(){
    var config = {
        method: 'get',
        url: url_blazeRoyaleR,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
        }
      };
      
      axios(config)
      .then(function (response) {
        const BlazeRoyaleR = require("./models/BlazeRoyaleR")
        let res = JSON.stringify(response.data.data)
        let res_Tonextpage = JSON.parse(JSON.stringify(response.data))
        let resToJson = JSON.parse(res)
        for(let i=0; i<resToJson.length;i++){
          let email_user = resToJson[i].client_email
          let plan_id = "prorv677"
          let plan_status = resToJson[i].trans_status == "Pagamento Aprovado"?SaveDataRecived(email_user, resToJson[i].trans_status, plan_id, BlazeRoyaleR, url_blazeRoyaleR):"";
        }
        try{
            res_Tonextpage.next_page_url == null?(()=>{
                // Terminated - Next -->
                VerifyGroupMilionBlazeR()
            })():(()=>{
                url_blazeRoyaleR = res_Tonextpage.next_page_url;
                return VerifyGroupBlazeRoyaleR()
            })()
        }catch(e){
            console.log(e)
        }
      })
      .catch(function (error) {
        return VerifyGroupBlazeRoyaleR()
      });
}

////-----------

let url_milionBlaze = `https://ev.braip.com/api/vendas?product_key=pro7rwod&date_min=${date_before} 11:15:00&date_max=${date_today} 11:15:00`
function VerifyGroupMilionBlazeR(){
    var config = {
        method: 'get',
        url: url_milionBlaze,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
        }
      };
      
      axios(config)
      .then(function (response) {
        console.log(url_milionBlaze)
        let MilionBlazeR = require("./models/MilionBlazeR")
        let res = JSON.stringify(response.data.data)
        let res_Tonextpage = JSON.parse(JSON.stringify(response.data))
        let resToJson = JSON.parse(res)
        for(let i=0; i<resToJson.length;i++){
          let email_user = resToJson[i].client_email
          let plan_id = "pro7rwod"
          let plan_status = resToJson[i].trans_status == "Pagamento Aprovado"?SaveDataRecived(email_user, resToJson[i].trans_status, plan_id, MilionBlazeR, url_milionBlaze):"";
        }
        try{
            res_Tonextpage.next_page_url == null?(()=>{
              const axios =  require("axios");
              // Vamos pega o plano, logo pegaremos a primeira ocorrência, pegaremos a data max e data min, assim poderemos fazer uma requisição;
              // Utilizando a data max e data min como parametros de url, vamos passar todos usuarios na primeira url, os que ele encontrar
              // Deve verificar se o status esta como aprovado, caso não seja aprovado, ele deve remover o usuario do grupo, verificar se tem
              // nex_url_site, caso possua, ir na próxima url e passar todos os usuarios mais uma vez de forma consecutiva, até chegar no fim.
              
              const RemoveUsers = require("../remove_addusers/removeUsers")
              let max_date;
              let min_date;
              let last_max_date;
              let last_min_date;
              let next_date;
              let url;
              let next_url = null; 
              let plans = ["MilionBlazeR", "BlazeRoyale","BlazeRoyaleR", "MilionBlazeVip"]
              let plans_key = ["pro7rwod", "pro5ydyq","prorv677", "proox1gw"]
              let plan = 0;
              let emails = []
              let data_ = []
              // Começar localizando o primeiro plano, e sua primeira data max e data min
              // Vamos criar um metodo para ele aumentar o dia enquanto o usuario não for encontrado nas url, idependente se nao seja aprovado.
              async function getDatePlans(){
                  if(plans[plan] == null){
                    const RemoveUsers = require("../remove_addusers/removeUsers")
                    return RemoveUsers()
                  }else{
                      const Model = require(`./models/${plans[plan]}`)
                      let oneResultPlan = await Model.findOne()
                      let lastResultPlan = await Model.find()
                      try{
                          max_date = oneResultPlan.max_date
                          min_date = oneResultPlan.min_date
                          last_max_date = lastResultPlan[lastResultPlan.length - 1].max_date
                          last_min_date = lastResultPlan[lastResultPlan.length - 1].min_date
                      }catch(e){
                          console.log(e)
                          
                      }
                      console.log(max_date)
                      console.log(min_date)
                      let totalResults = await Model.find()
                      // Todos emails para serem verificados -->
                      for(let i in totalResults){
                          emails.push(totalResults[i].email_user)
                      }
                      findEmailStatus()
                  }
              }
              getDatePlans()
              let urlMail;
              function findEmailStatus(nexturl){
                  if(nexturl != null){
                      url = nexturl
                  }else{
                      url = `https://ev.braip.com/api/vendas?product_key=${plans_key[plan]}&date_min=${min_date}%2011%3A15%3A00&date_max=${max_date}%2011%3A15%3A00`
                  }
                  const config = {
                      url:url,
                      method:"GET",
                      headers: { 
                          'Content-Type': 'application/json', 
                          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
                        }
                  }
                  axios(config)
                  .then(async(response)=>{
                      let url_keep = false;
                      let urlSaved;
                      let data = response.data.data
                      console.log(url)
                      // Metodo para verificar o status dos esmails diretamente na api e remover os status diferente de aprovado
                     const Model = require(`./models/${plans[plan]}`)
                     for(let o=0; o<data.length; o++){
                      for(let i=0; i<emails.length; i++){
                              if(emails[i] == data[o].client_email){
                                  if(data[o].trans_status == "Pagamento Aprovado"){
                                      "PAGAMENTO APROVADO"
                                      console.log(emails[i]+" "+data[o].trans_status+" "+url)
                                      emails = emails.filter((value)=>{
                                        return value != emails[i]
                                    })        
                                  }else{
                                    // Se ele não achou o user como aprovado, pegaremos a url pertencente a ele na db e passaremos, para
                                    // verificar se realmente está reprovado.'
                                    let lastOccurrence;
                                    for(let elem in data){
                                      if(data[elem].client_email == emails[i]){
                                        lastOccurrence = elem
                                      }
                                    }
                                    if(data[lastOccurrence].trans_status == "Pagamento Aprovado"){
                                      emails = emails.filter((value)=>{
                                        return value != emails[i]
                                    })        
                                    }
                                    else if(response.data.next_page_url != null){
                                      if(url_keep == false){
                                        urlSaved = url
                                        url_keep = true // Keep current url
                                      }
                                      urlMail = response.data.next_page_url
                                      
                                      console.log(i)
                                    }else{
                                      url_keep = false
                                      await Model.findOneAndRemove({email_user:emails[i]})
                                      emails = emails.filter((value)=>{
                                        return value != emails[i]          
                                      })
                                    }
                                    }
                                      
                                  }else if(response.data.next_page_url == null){
                                    // Ja verificou o usuario em todas outras urls, mas não encontrou, resolve desse jeito aqui:
                                    if(url_keep == true){
                                      console.log("Já terminou todas url do next")
                                    }
                                  }
                             
                          }
                      }      
                      // Terminou o laço, verifique se tem próxima url, e passe os emails novamente.
                      if(url_keep == true){ // posterior
                        console.log("A")
                        return findEmailStatus(urlMail)
                      }
                      else if(response.data.next_page_url != null){ // Anterior
                        console.log("Finalizado")
                        console.log(emails)
                        if(urlSaved != null){
                          url = urlSaved
                          urlSaved = null
                          console.log(urlSaved)
                          return findEmailStatus(url)
                        }else{
                          let url_ = response.data.next_page_url
                          return findEmailStatus(url_)
                        }
                      }else if(emails.length != 0){
                          // Mas, antes iremos verificar TUDO, aumentando a data, até não ter nenhum email constando verificação.
                          // Enquanto o tamanho do emails for maior que 0, aumentaremos o date
                          if(last_max_date == max_date){
                            for(let i in emails){
                              await Model.findOneAndRemove({email_user:emails[i]})
                            }   
                          plan++
                          emails = [];
                          url = null
                          return getDatePlans()
                          }else{
                            let new_datemax = new Date(new Date(max_date).getTime() + (86400000*2)).toLocaleDateString("pt-BR").split("/")
                            max_date = new_datemax[2]+"-"+new_datemax[1]+"-"+new_datemax[0]  
                            let new_datemin = new Date(new Date(min_date).getTime() + (86400000*2)).toLocaleDateString("pt-BR").split("/")
                            min_date = new_datemin[2]+"-"+new_datemin[1]+"-"+new_datemin[0]  
                            urlSaved = null;
                            return findEmailStatus()
                          }
                      }
                      else{
                          
                          plan++
                          emails = [];
                          url = null
                          return getDatePlans()
                      }
                  })
              }
            })():(()=>{
                url_milionBlaze = res_Tonextpage.next_page_url;
                return VerifyGroupMilionBlazeR()
            })()
        }catch(e){
            console.log(e)
        }
      })
      .catch(function (error) {
        return VerifyGroupMilionBlazeR()
      });
}


async function SaveDataRecived(email, status, planId, model, url_finded){
  let user = await model.find({email_user:email})
            try {
              `${user}` == [] || `${user}` == "[]" || `${user}` == null?(async()=>{
                await model.create({
                  email_user:email,
                  plan_status:status,
                  plan_id:planId,
                  max_date:date_today.toString(),
                  min_date:date_before.toString(),
                  page_find:url_finded
                })
              })():""
            } catch (e) {
              console.log(e)
            }
          }
            })
        })
    })
};

(async()=>{
  let user = "botTelegram"
  let password = "bottelegram2022"
  mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.e60ei.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
  .then(()=>{
    console.log("Connected with sucess")
  }).catch((e)=>{
    console.log(e)
  })
})();

