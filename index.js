const express = require('express');
const app = express();
const port = 3000;

const nedb = require('nedb');
const dataBase = new nedb('database.db');
dataBase.loadDatabase();

require('dotenv').config();






app.listen(port, () =>{
    console.log('Ouvindo na porta 3000')
    
})

app.use(express.static('teste 2'));
app.use(express.json())

app.post('/apiFoda', (request, response)=>{

    console.log('eu recebi uma requesição POST')
    let data = request.body
    console.log(data)
    let time = Date.now()
    data.timestamp = time
    
    console.log(data)
    
    dataBase.insert(data)
    response.json({
        status: 'ok POST',
        number: 200,
        request: request.body
    })
   
})

app.get('/apiFoda', (request, response)=>{
    console.log('eu recebi uma requisição GET')
    console.log(request.body)
    let data = request.body
   


    dataBase.find({}, (err,data)=>{
        if(err){
            console.log(err)
        } else {
            console.log('tudo certo')
            console.log(data)

            response.json(data)

        }
    })


})

app.get("/apiWeather/:latlng", async (request, response)=>{
    console.log("Requisição GET Weather")
    console.log(request.params);
    let latlng = request.params.latlng.split(",")
    let lat = latlng[0]
    let lng = latlng[1]
    console.log(latlng)
    
    let apiKey = process.env.API_KEY;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;
    let responseWeather = await fetch(apiUrl)
    let dataWeather = await responseWeather.json()

    let responseAir = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${apiKey}`)

    let dataAir = await responseAir.json()
    console.log("data air:", dataAir)
    
    let finalData = {
        weather: dataWeather,
        air: dataAir
        
    }


    let req = request.body
    console.log(req)

    response.json({finalData})
})


    