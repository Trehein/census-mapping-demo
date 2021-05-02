# census-mapping-demo
A static demographic map example utilizing census API call and D3.js

# Project Setup
Create a config.js file in the project root and add your census key and a getter for it
```JavaScript
const yourCensusKey = "YOUR_KEY_GOES_HERE"

function getKey () {
    return yourCensusKey;
}
```

# Resources
### Datasets and API's
[Decennial Census Dataset API's](https://www.census.gov/data/developers/data-sets/decennial-census.html)
[Decennial Census Self-Response Rates API](https://www.census.gov/data/developers/data-sets/decennial-response-rates.html)
[Apportionment Datasets](https://www.census.gov/data/tables/2020/dec/2020-apportionment-data.html)
[Guide to Apportionment Calculations](https://www.census.gov/newsroom/blogs/random-samplings/2021/04/how-apportionment-is-calculated.html)
[Apportionment Data CSV](https://raw.githubusercontent.com/Trehein/datasets/master/apportionment.csv)
[NYT COVID CSV](https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv
)

### Drawing the map
[TopoJSON Library](https://github.com/topojson)
[U.S. Atlas TopoJSON](https://github.com/topojson/us-atlas)

### Better Examples
[County Level with Hover Effect](https://bl.ocks.org/anonymous/dae443994bdd438c5c45688aeb0a4f03)
[COVID-19 Cases by County](https://observablehq.com/@pamacha/covid-19-cases-by-county?collection=@observablehq/county-maps)