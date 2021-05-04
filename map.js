

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
    let dimensions = {
        width: window.innerWidth * 0.90,
        height: window.innerHeight * 0.90,
        margin: {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10,
        },
    }
    dimensions.boundedWidth = dimensions.width
        - dimensions.margin.left
        - dimensions.margin.right

    let path = d3.geoPath()

    // Draw canvas

    const wrapper = d3.select("#wrapper")
        .append("svg")
            .attr("width", dimensions.width)
            .attr("height", dimensions.height)

    const zoomWrapper = wrapper.append("g") // container g to call zoom functions on
        .attr("id", "zoomWrapper")

    const bounds = zoomWrapper.append("g")
        .attr("id", "bounds")

    // const colorSet = d3.scaleQuantize()
    //     .range(["#e8f5e9", "#c8e6c9", "#a5d6a7", "#81c784", "#66bb6a", "#4caf50", "#43a047", "388e3c", "#388e3c", "#2e7d32", "#1b5e20"])
    //     .domain([popExtent[0], popExtent[1]])

    // color using d3 color scheme more schemes at https://github.com/d3/d3-scale-chromatic
    const colorSetBlues = d3.scaleQuantize()
        .range(d3.schemeBlues[9])
        .domain([popExtent[0], popExtent[1]])

    // const colorSetSpectral = d3.scaleQuantize()
    //     .range(d3.schemeSpectral[9])
    //     .domain([popExtent[0], popExtent[1]])

    let mapPaths = bounds.selectAll(".path")
        .data(stateApportionmentDataPack)
        .join("path")
        .attr("d", path)
        .attr("stroke", "black")
        .attr("stroke-width", .5)
        .attr("fill", d => {
            if (d.properties.appPop) {
                return colorSetBlues(d.properties.appPop)
            } else {
                return "orange"
            }
        })
        .on('mouseover', handlePathOver)
        .on('mouseout', handlePathOut)
        .on('click', handlePathClick)

    // add circles

    let projection = d3.geoAlbersUsa()
        .translate([487.5, 305])
        .scale(1300)

    const circleG = bounds.append("g")

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

    // interactions

    function handlePathOver(d, i) {
        d3.select(this)
            .transition()
            .duration(350)
            .attr("fill", d => 'orange')
    }

    function handlePathOut(d, i) {
        d3.select(this)
            .transition()
            .duration(350)
            .attr("fill", d => {
                if (d.properties.appPop) {
                    return colorSetBlues(d.properties.appPop)
                } else {
                    return "orange"
                }
            })    
    }

    function handlePathClick(d, i) {
        let selectedPath = d3.select(this) 
        console.log(selectedPath._groups[0][0].__data__.properties)
    }

    // zoom 

    var zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on('zoom', function(event) {
            mapPaths
                .attr('transform', event.transform);
            demoCircles
                .attr('transform', event.transform)
    });

    wrapper.call(zoom)

}

drawMap();