const express = require('express')
const fetch = require('cross-fetch')
const fs = require('fs')

const app = express()

let resultData = []
let arrOfCoords = []
let coordsSet = new Set()
let addressSet = new Set()

app.get('/', function (req, res) {
    let jsonData = require('./data.json')

    jsonData.forEach(obj => {
        addressSet.add(obj.address)
        coordsSet.add(obj.coords)   
    })

    arrOfCoords = [...coordsSet]
    arrOfCoords.forEach((val, index) => {
        let feature = {}
        feature.type = 'Feature'
        feature.properties = {}
        
        feature.properties.address = [...addressSet][index]
        feature.properties.time = {}

        feature.geometry = {}
        feature.geometry.type = 'Point'
        feature.geometry.coordinates = val.split(' ')
        
        resultData.push(feature)
    })

    jsonData.forEach((obj, index) => { // 3060 записей
        resultData.forEach((val, idx) => { // 20 записей
            if (obj.address === val.properties.address) {
                val.properties.time[obj.Date] = {}
                val.properties.time[obj.Date].benzol = obj.benzol
                val.properties.time[obj.Date].carbonmonoxideconcentratio = obj.carbonmonoxideconcentratio
                val.properties.time[obj.Date].nitrogendioxideconcent = obj.nitrogendioxideconcent
                val.properties.time[obj.Date].nitrogenOxideNO = obj.nitrogenOxideNO
                val.properties.time[obj.Date].particles_10mkm = obj.particles_10mkm
                val.properties.time[obj.Date].particles_25mkm = obj.particles_25mkm
                val.properties.time[obj.Date].so2 = obj.so2
                val.properties.time[obj.Date].toluol = obj.toluol
            }
        })
    })

    res.send(resultData)
})

app.listen(3000, function () {
    console.log('север дует на http://localhost:3000')
})


