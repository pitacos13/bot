const mongoose = require("mongoose")

var axios = require('axios');
const fs = require("fs");
const bot = require("../bot");
process.env.TZ = 'America/Sao_Paulo';
async function RemoveOrAdd(){
  const RemoveUsers = require("../remove_addusers/removeUsers")

    fs.readFile("./date.txt", "utf-8", (err,data)=>{
        if(err) return console.log(err)
        let dateMyAfter = data
        //Arm ---->
        console.log(data)
        let date_now = new Date(Date.now() + 86400000).toLocaleDateString("pt-BR")
        let until = JSON.parse(data).date_until.split("/")
         // Ano - Mes - Dia / Formato do javascript
        let datas = new Date(until[2]+"-"+until[1]+"-"+until[0]).getTime() + (86400000*2)
        let dateUntil = new Date(datas).toLocaleDateString("pt-BR")
        // <-----
        fs.writeFile("./date.txt", JSON.stringify({date_today:date_now, date_until:dateUntil}), (err, data)=>{
            if(err) return console.log(err)
            console.log("Sucess")
            fs.readFile("./date.txt", "utf-8", (err,data)=>{
                if(err) return console.log(err)
                let dateNowMy = Date.now()
                let data_json = new Date(dateNowMy).toLocaleDateString("pt-BR")
                // Year - month - day
                let date_today = data_json.split("/")[2]+"-"+data_json.split("/")[1]+"-"+data_json.split("/")[0]
                let dataMy_json = JSON.parse(dateMyAfter)
                console.log(dataMy_json)
                let date_before = dataMy_json.date_until.split("/")[2]+"-"+dataMy_json.date_until.split("/")[1]+"-"+dataMy_json.date_until.split("/")[0]
                /////// ---------- Functions ---------//////
let urls = [
`https://ev.braip.com/api/vendas?product_key=proox1gw&date_min=${date_before} 00:00:00&date_max=${date_today} 23:59:59`,
`https://ev.braip.com/api/vendas?product_key=prorv677&date_min=${date_before} 00:00:00&date_max=${date_today} 23:59:59`, 
`https://ev.braip.com/api/vendas?product_key=pro5ydyq&date_min=${date_before} 00:00:00&date_max=${date_today} 23:59:59`,
`https://ev.braip.com/api/vendas?product_key=pro7rwod&date_min=${date_before} 00:00:00&date_max=${date_today} 23:59:59`
]
let plansOfUrls = ["MilionBlazeVip", "BlazeRoyaleR", "BlazeRoyale", "MilionBlazeR"]
let i = 0;
async getAllAppproved(urls[i])
function getAllAppproved(url){
    const config = {
        url:url,
        method:"get",
        headers:{
            'Content-Type':' application/json', 
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIn0.eyJhdWQiOiI0Nzc1MyIsImp0aSI6IjAxMWI1NTIzNTE3OGI2ZGIwYjg3NjZmYWM4OWRhYjNlNmE5MzU3OWY5Yzc4M2U1NGJjZDhkNDM2ZmJkNDgwYmM5MWYwMTg1ODcxNzg0MzYxIiwiaWF0IjoxNjQ3OTYwNTUwLCJuYmYiOjE2NDc5NjA1NTAsImV4cCI6MTY3OTQ5NjU1MCwic3ViIjoiNTk4NzgzMyIsInNjb3BlcyI6W119.F7QI2J8R8UbNKwTcJK4patZzBQuK7Vu6IePh4Zem6kXSG1szT4cc4YgU6NTCR-K33WjtVo8W7fxdy9Ax--Wx6SLJNs5_CAW4IvkkmQyd0oqi-NChL8KsMFobSx33Ye15quNUYiR54HXMrbkP-tP-XVtYiTSxd-DQt5XhLTfgMGwNF1rrBUGdOFcdTeeton_1K2cZEYi-iUpWyG2OV6mZf-YOVPLwrwJL_oVZMEIcQHytK_4wzlO_AqT-kSIkSWlkW2gooFf3ghr2E0vF1rInAg0YWW0I8nHcevybdGG6msbLP6uQJpr1vHFd-QIVqem0pW0PEYcB7OsJ4ROFrCHXAO_m8DtW2bYyUoFcAkjF2Ar2y8XZ_hw_ZW-lwftQ-J34VHqfAUQQESHAJcJCqZT4hGX9-BLCZJy4h-UCZGgq2kzc-CpmJYLpPQ-FMhpOWwk586ikKLn6ibQ9AZK9jwITfN0ylXJhSbWxvG0GY8dIHD6IrNj_kK7RgXHxQ_vwjsEvLkfzaGm3ijnyHsjORcqXQUWhZ67-mSeRXh1zKU7TBOSDkuTAXICoEBu-Sfd0Ocn5GC1RzinRjgIrr87NmlIuFKxGxrvqSZivDApQz4rX5J2yQNv41PAXF89hzAsGUl6VhYK427pb3cdPF50S4HGOlDgGbKv_ugPwNf3afo-6FTY'
        }
    }
    axios(config).then((r)=>{
        let values = r.data.data
        let next_url = r.data.next_page_url
        const Models = require(`./models/${plansOfUrls[i]}`)
        for(let value of values){
            if(value.trans_status == "Pagamento Aprovado"){
                let email_user = value.client_email
                let date_payment = value.trans_updatedate
                let trans_status = value.trans_status
                let plan_id = value.product_key
                await SaveDataRecived(email_user, trans_status, plan_id, Models, url, date_payment)
            }
        }
        if(next_url != null){
            getAllAppproved(next_url)
        }else{
            console.log("Finished")
            i++
            if(url[i] == undefined){

                //-------Metods-------------------------------


                //----------------------------------------------

            }else{
                getAllAppproved(urls[i])
            }
        }
    })
}

///////------=========================================================================================
///////------=========================================================================================
///////------=========================================================================================
///////------=========================================================================================
///////------=========================================================================================




async function SaveDataRecived(email, status, planId, model, url_finded, datepay){
  let user = await model.findOne({email_user:email})
              user == null?(async()=>{
                await model.create({
                  email_user:email,
                  plan_status:status,
                  plan_id:planId,
                  max_date:date_today.toString(),
                  min_date:date_before.toString(),
                  page_find:url_finded,
                  date_payment:datepay
                })
              })():""
}

            })
        })
    })
};
RemoveOrAdd();

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

