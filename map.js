

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

    //bound datasets
    const stateDataPack = stateDataBinder(stateShapes, stateCensusData2020)
    const countyDataPack = countyDataBinder(countyShapes, countyCensusData2020)
    const stateApportionmentDataPack = stateApportionmentBinder(stateShapes, stateApportionmentData)

    const popExtent = getExtent(stateApportionmentDataPack, "appPop")
    console.log(popExtent)

    const repExtent = getExtent(stateApportionmentDataPack, "appReps")
    console.log(repExtent)


    // Chart setup
    // let dimensions = {
    //     width: window.innerWidth * 0.65,
    //     height: window.innerHeight * 0.80,
    //     margin: {
    //         top: 10,
    //         right: 10,
    //         bottom: 10,
    //         left: 10,
    //     },
    // }
    // dimensions.boundedWidth = dimensions.width
    //     - dimensions.margin.left
    //     - dimensions.margin.right

    let path = d3.geoPath()

    let svg = d3.select("#wrapper")

    let mapG = svg.append('g')
        .attr("id", "mapG")

    // const colorSet = d3.scaleQuantize()
    //     .range(["#e8f5e9", "#c8e6c9", "#a5d6a7", "#81c784", "#66bb6a", "#4caf50", "#43a047", "388e3c", "#388e3c", "#2e7d32", "#1b5e20"])
    //     .domain([popExtent[0], popExtent[1]])


    // color using d3 color scheme more schemes at https://github.com/d3/d3-scale-chromatic
    // const colorSet = d3.scaleQuantize()
    //     .range(d3.schemeBlues[9])
    //     .domain([popExtent[0], popExtent[1]])

    const colorSet = d3.scaleQuantize()
        .range(d3.schemeSpectral[9])
        .domain([popExtent[0], popExtent[1]])

    let mapPaths = mapG.selectAll("path")
        .data(stateApportionmentDataPack)
        .join("path")
        .attr("d", path)
        .attr("stroke", "black")
        .attr("stroke-width", .5)
        .attr("fill", d => {
            if (d.properties.appPop) {
                return colorSet(d.properties.appPop)
            } else {
                return "orange"
            }
        })


    // add circles

    let projection = d3.geoAlbersUsa()
        .translate([487.5, 305])
        .scale(1300)

    const circleG = svg.append("g")

    const demoCircles = circleG.selectAll(".circle")
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