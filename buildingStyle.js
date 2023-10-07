let populationRanges = [
    {
        "Density": "EXTREMEHIGH",
        "Color": "red",
        "MinPop": 2000
    },
    {
        "Density": "HIGH",
        "Color": "orange",
        "MinPop": 1200
    },
    {
        "Density": "MID",
        "Color": "yellow",
        "MinPop": 800
    },
    {
        "Density": "LOW",
        "Color": "green",
        "MinPop": 400
    },
    {
        "Density": "EXTREMELOW",
        "Color": "grey",
        "MinPop": 0
    }
]

function getColorByPopulation(population){
    for(var i=0; i<populationRanges.length; i++){
        if(population >= populationRanges[i].MinPop){
            return populationRanges[i].Color;
        }
    }
    return null
}

function drawShapesOnMap(path, map){
    fetch(path)
    .then(response => response.json())
    .then(data => {
        for(var i=0; i < data.features.length; i++){
            var population = data.features[i].properties.Population;
            var color = getColorByPopulation(population)

            var vectorSource = new ol.source.Vector({
                features: new ol.format.GeoJSON().readFeatures(data.features[i])
            });

            const vectorLayer = new ol.layer.Vector({
                source: vectorSource
            });

            map.addLayer(vectorLayer);
        }
    })
    .catch(error => console.error('Error:', error));
}