const demoCirclesData = [
    {
        "lat": 42.9686935685962,
        "long": -87.90937755223892,
        "size": 10
    },
    {
        "lat": 19.660775886425448, 
        "long": -155.5106189425138,
        "size": 15
    },
    {
        "lat": 65.61026265691557,
        "long": -151.87628915860822,
        "size": 20
    }
]


function convertToJSON(array) {
    let returnJSON = []
    for (let i = 1; i < array.length; i++) {
        returnJSON[i - 1] = {};
        for (let j = 0; j < array[0].length && j < array[j].length; j++) {
            let key = array[0][j];
            returnJSON[i - 1][key] = array[i][j]
        }
    }
    return returnJSON
}

// needs work to become universal, find way to automate var grabbing and creation
// try using json keys...
// Object.keys(jsonData).forEach(function(key) {
//     var value = jsonData[key];
//     // ...
// });

const stateDataBinder = (stateShapes, stateData) => {
    let boundMapData = stateShapes;

    for (let i = 0; i < stateData.length; i++) {
        let stateId = stateData[i].state;
        let crrAll = stateData[i].CRRALL;
        let crrInt = stateData[i].CRRINT;
        let drrAll = stateData[i].DRRALL;
        let geoId = stateData[i].GEO_ID;
        let name = stateData[i].NAME;

        for (let j = 0; j < stateShapes.length; j++) {
            let shapeName = stateShapes[j].properties.name;

            if (name === shapeName) {
                boundMapData[j].properties.stateId = stateId;
                boundMapData[j].properties.crrAll = crrAll;
                boundMapData[j].properties.crrInt = crrInt;
                boundMapData[j].properties.drrAll = drrAll;
                boundMapData[j].properties.geoId = geoId;
                break;
            }
        }
    }

    return boundMapData;
}

const countyDataBinder = (countyShapes, countyData) => {
    let boundMapData = countyShapes;

    for (let i = 0; i < countyData.length; i++) {
        let dataId = countyData[i].GEO_ID.substr(countyData[i].GEO_ID.length - 5);
        let crrAll = countyData[i].CRRALL;
        let crrInt = countyData[i].CRRINT;

        for (let j = 0; j < countyShapes.length; j++) {
            let shapeId = countyShapes[j].id

            if (dataId === shapeId) {
                // console.log("match")
                boundMapData[j].properties.crrAll = crrAll
                boundMapData[j].properties.crrInt = crrInt
            }
        }
    }

    return boundMapData
}

const stateApportionmentBinder = (stateShapes, apportionmentData) => {
    let boundMapData = stateShapes;
    console.log(apportionmentData)

    for (let i = 0; i < apportionmentData.length; i++) {
        let appName = apportionmentData[i].state;
        let appPop = apportionmentData[i].appPop;
        let appChange = apportionmentData[i].changeFrom2010;
        let appReps = apportionmentData[i].reps;

        for (let j = 0; j < stateShapes.length; j++) {
            let shapeName = stateShapes[j].properties.name;

            if (appName === shapeName) {
                boundMapData[j].properties.appPop = appPop
                boundMapData[j].properties.appChange = appChange
                boundMapData[j].properties.appReps = appReps
            }
        }
    }

    return boundMapData;
}


function getExtent(arr, prop) {
    let extent = []
    extent.push(getMin(arr, prop))
    extent.push(getMax(arr, prop))

    return extent
}

function getMax(arr, prop) {
    let max;
    for (let i = 0; i < arr.length; i++) {
        if (max == null || parseInt(arr[i].properties[prop]) > parseInt(max)) {
            max = arr[i].properties[prop];
        }
    }
    return max;
}

function getMin(arr, prop) {
    let min;
    for (let i = 0; i < arr.length; i++) {
        if (min == null || parseInt(arr[i].properties[prop]) < parseInt(min)) {
            min = arr[i].properties[prop];
        }
    }
    return min
}