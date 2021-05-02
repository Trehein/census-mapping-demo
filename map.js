

async function drawMap() {
    // full topojson with national, state, and county path features
    const us = await d3.json("https://unpkg.com/us-atlas@3/counties-albers-10m.json");

    // feature path collections for county and state lines
    const countyShapes = topojson.feature(us, us.objects.counties).features.sort((a,b) => +a.id - +b.id)
    const stateShapes = topojson.feature(us, us.objects.states).features.sort((a,b) => +a.id - +b.id)

    // census datasets
    const rawStateCensusData2020 = await d3.json("https://api.census.gov/data/2020/dec/responserate?get=NAME,GEO_ID,DRRALL,CRRINT,RESP_DATE,CRRALL,DRRINT&for=state:*&key=" + getKey())
    const rawCountyCensusData2020 = await d3.json("https://api.census.gov/data/2020/dec/responserate?get=NAME,GEO_ID,DRRALL,CRRINT,RESP_DATE,CRRALL,DRRINT&for=county:*&key=" + getKey())
    const stateApportionmentData = await d3.csv("https://raw.githubusercontent.com/Trehein/datasets/master/apportionment.csv")
    
    const stateCensusData2020 = convertToJSON(rawStateCensusData2020)
    const countyCensusData2020 = convertToJSON(rawCountyCensusData2020)

    // const rawTest = await d3.json("https://api.census.gov/data/2010/dec/sf2?get=NAME,HCT001001&for=state:*&key=" + getKey())
    // const test = convertToJSON(rawTest) ;

    //bound datasets
    const stateApportionmentDataPack = stateApportionmentBinder(stateShapes, stateApportionmentData)
    // console.log(stateApportionmentDataPack)

    const stateDataPack = stateDataBinder(stateShapes, stateCensusData2020)
    // console.log(stateDataPack)

    const countyDataPack = countyDataBinder(countyShapes, countyCensusData2020)
    console.log(countyDataPack)

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

    // console.log(demoCircles)

    let path = d3.geoPath()

    let svg = d3.select("#wrapper")

    let mapG = svg.append('g')
        .attr("id", "mapG")

    const colorSet = d3.scaleQuantize()
        // .range(["#e8f5e9", "#c8e6c9", "#a5d6a7", "#81c784", "#66bb6a", "#4caf50", "#43a047", "388e3c", "#388e3c", "#2e7d32", "#1b5e20"])
        .range(["white", "red", "blue", "green", "yellow", "orange"])
        .domain([50, 100])

    let mapPaths = mapG.selectAll("path")
        .data(stateDataPack)
        .join("path")
        .attr("d", path)
        .attr("stroke", "black")
        .attr("stroke-width", .5)
        .attr("fill", d => {
            if (d.properties.crrAll) {
                return colorSet(d.properties.crrAll)
            } else {
                return "orange"
            }
            
        })
        // .attr("fill", "orange")



    let projection = d3.geoAlbersUsa()
        .translate([487.5, 305])
        .scale(1300)

    const demoCircles = svg.selectAll(".circle")
        .data(demoCirclesData)
        .enter().append('circle')
        .attr("cx", d => {
            return projection([d.long, d.lat])[0];
        })
        .attr("cy", d => {
            return projection([d.long, d.lat])[1];
        })
        .attr("r", d => {
            return Math.sqrt(d.size);
        })






    

}

drawMap();