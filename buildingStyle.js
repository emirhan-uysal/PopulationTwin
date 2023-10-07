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

function getStyleByPopulation(population){
    var fillColor = getColorByPopulation(population);
    var strokeColor = "black";
    var strokeWidth = 1.2;
    var text = population.toString();
    var textFont = "bold 10px serif";

    const style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: fillColor,
        }),
        stroke: new ol.style.Stroke({
            color: strokeColor,
            width: strokeWidth
        }),
        text: new ol.style.Text({
            text: text,
            font: textFont
        })
    });
    return style
}

function drawShapesOnMap(path, map){
    fetch(path)
    .then(response => response.json())
    .then(data => {
        const format = new ol.format.GeoJSON();
        const features = format.readFeatures(data)

        let vectorSource = new ol.source.Vector();
        let style, population;

        features.forEach((feature, index) => {
            population = feature.getProperties().Population;
            style = getStyleByPopulation(population);

            feature.setStyle(style);
            vectorSource.addFeatures([feature]);
            let allFeatures = vectorSource.getFeatures();
            allFeatures.forEach((f, i) => {
                console.log("Index: ",index+"."+i,"\nPopulation: ",f.getProperties().Population ,"\nColor: ",f.getStyle().getFill().getColor())        
            })
        });
        
        let vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            opacity: 0.8,
            visible: true,
            zIndex: 2,
            title: "VectorLayer"
        });

        let f = vectorLayer.getSource().getFeatures();
        f.forEach((a, b) => {
            console.log(a.getProperties());
        })

        map.addLayer(vectorLayer);
    
        var layers = map.getLayers();
            layers.forEach(function(layer) {
            console.log("DSOM) ",layer.get('title'));
        });
    })
    .catch(error => console.error('Error:', error));
}