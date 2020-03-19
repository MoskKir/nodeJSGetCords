const express = require('express')
const fetch = require('cross-fetch')
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node');


const app = express()

const schema = {
    'address': {
      prop: 'address',
      type: String
    },
    'benzol': {
      prop: 'benzol',
      type: Number,
      required: false
    },
    'carbonmonoxideconcentratio': {
      prop: 'carbonmonoxideconcentratio',
      type: Number
    },
    'Date': {
        prop: 'Date',
        type: String
    },
    'direction_wind': {
        prop: 'direction_wind',
        type: String
    },
    'humidity': {
        prop: 'humidity',
        type: Number,
        required: false
    },
    'ksilol': {
        prop: 'ksilol',
        type: Number
    },
    'nitrogendioxideconcent': {
        prop: 'nitrogendioxideconcent',
        type: Number
    },
    'nitrogenOxideNO': {
        prop: 'nitrogenOxideNO',
        type: Number
    },
    'particles_10mkm': {
        prop: 'particles_10mkm',
        type: Number
    },
    'particles_25mkm': {
        prop: 'particles_25mkm',
        type: Number
    },
    'Atmospheric_pressure': {
        prop: 'Atmospheric_pressure',
        type: Number
    },
    'so2': {
        prop: 'so2',
        type: Number
    },
    'speedwind': {
        prop: 'speedwind',
        type: Number
    },
    'temperature': {
        prop: 'temperature',
        type: Number
    },
    'toluol': {
        prop: 'toluol',
        type: Number
    },
    'URL': {
        prop: 'URL',
        type: String
    }   

  }

readXlsxFile('./air.xlsx', { schema }).then(({ rows, errors }) => {
    let dataFromXlsx = rows
    let arrayOfPromises = []
    dataFromXlsx.map( obj => {
        const URI = `https://geocode-maps.yandex.ru/1.x/?apikey=8d39a74f-0db6-4216-b439-e4e16e100cae&format=json&geocode=${obj.address}`;
        const encodedURI = encodeURI(URI);
        arrayOfPromises.push(fetch(encodedURI))
    })
    
    Promise.all(arrayOfPromises)
        .then(res => {
            return Promise.all(res.map(val => {
                return val.json()
            }))
        })
        .then(data => {
            let arrCords = []
            let countRow = 1
            data.forEach(val => { 
                arrCords.push(val.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos)
            })
            dataFromXlsx.map((obj, index) => {
                console.log(countRow++)
                return obj.coords = arrCords[index]
            })
            return dataFromXlsx
        })
        .then( dataFromXlsx => {
            fs.writeFileSync('data.json', JSON.stringify(dataFromXlsx))
        })

    app.get('/', function (req, res) {
        res.send(dataFromXlsx);
    });

})

app.listen(3000, function () {
    console.log('север дует на http://localhost:3000');
});


