const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


const nedb = require('nedb');
const dataBase = new nedb('database.db');
dataBase.loadDatabase();

require('dotenv').config();






app.listen(port, () =>{
    console.log(`Ouvindo em ${port}`)
    
})

app.use(express.static('teste 2'));
app.use(express.json())

app.post("/apiBanco", (request, response)=>{

    console.log('eu recebi uma requesição POST')
    let data = request.body
    
    
    
    
    
    dataBase.findOne({latitude: data.latitude, longitude: data.longitude},(err, existingEntry) =>{

        if(err){
            console.log(err)
            return;
        }

        if(existingEntry){
            console.log("Latitude e Longitude encontrada no Banco!")
            response.json({
                status: "Duplicado",
                message: "Latitude e Longitude ja estão no Banco de dados",
                request: data
            })
        } else {
            let time = Date.now()
            data.timestamp = time
            dataBase.insert(data)
            response.json({
                status: 'ok POST',
                number: 200,
                request: request.body
    })
        }

    }
) //final do findOne

    
   
})







app.get("/apiBanco", (request, response)=>{
    console.log('eu recebi uma requisição GET')
    
    
   


    dataBase.find({}, (err,data)=>{
        if(err){
            console.log(err)
        } else {
            console.log('tudo certo')
            console.log( "console atual: " +data)

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
    
    
    let apiKey = process.env.API_KEY;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;
    let responseWeather = await fetch(apiUrl)
    let dataWeather = await responseWeather.json()

    let responseAir = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${apiKey}`)

    let dataAir = await responseAir.json()
    
    
    let finalData = {
        weather: dataWeather,
        air: dataAir
        
    }


    let req = request.body
    console.log(req)

    response.json({finalData})
})


    