

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

    let path = d3.geoPath()

    let svg = d3.select("#wrapper")
        .selectAll("path")
        .data(stateDataPack)
        .join("path")
        .attr("d", path)
        .attr("stroke", "black")
        .attr("stroke-width", .5)
        .attr("fill", "orange")



    // let svg = d3.select("#wrapper")
    //     .attr("viewBox", [0, 0, 975, 610]);

    // let g = svg.append("g")
    //     .attr("transform", "translate(610,20)")
    //     // .append(() => legend({color, title: data.title, width: 260}));
  
    // svg.append("g")
    //   .selectAll("path")
    //   .data(topojson.feature(us, us.objects.counties).features)
    //   .join("path")
    //     .attr("stroke", "black")
    //     .attr("stroke-width", "1px")
        // .attr("fill", d => color(data.get(d.id)))
        // .attr("d", path)
    //   .append("title")
    //     .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
    //     ${format(data.get(d.id))}`);
  
    // svg.append("path")
    //     .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    //     .attr("fill", "none")
    //     .attr("stroke", "black")
    //     .attr("stroke-linejoin", "round")
    //     .attr("d", path);





    // let features = new Map(topojson.feature(us, us.objects.counties).features.map(d => [d.id, d]))
    // let path = d3.geoPath()


    // console.log(features)

    // const svg = d3.select("#wrapper")
    
    // g.append("path") 
    //     .datum(topojson.feature(us, us.objects.nation))
    //     .attr("fill", "none")
    //     .attr("d", path)
    //     .attr("stroke", "black")

    // svg.append("path")
    //     .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    //     .attr("fill", "#e0e0e0")
    //     .attr("stroke", "black")
    //     .attr("stroke-linejoin", "round")
    //     .attr("d", path);

    // const g = svg.append("g")
    //     .attr("fill", "none")
    //     .attr("stroke", "#000")
    //     .attr("stroke-linejoin", "round")
    //     .attr("stroke-linecap", "round")

    // g.append("path")
    //     .attr("stroke-width", "0.5")
    //     .datum

    //     <path stroke="#aaa" stroke-width="0.5" d="${path(topojson.mesh(us, us.objects.counties, (a, b) => a !== b && (a.id / 1000 | 0) === (b.id / 1000 | 0)))}"></path>
    //     <path stroke-width="0.5" d="${path(topojson.mesh(us, us.objects.states, (a, b) => a !== b))}"></path>
    //     <path d="${path(topojson.feature(us, us.objects.nation))}"></path>
    //   </g>
    

}

drawMap();