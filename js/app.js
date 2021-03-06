$(document).ready(function(){
    
    chart = [];
    // load gauges
    populateGauges();
    
    // Initialize and plot the map
    populateMap();
    
    $('#map').fadeIn(1000);
    
    // simulating remote json call here for live data
    setInterval(function(){
        displayReservoirInformation();
    },5000);
    
    
});

function displayReservoirInformation(){
    $.getJSON("locations.json", function(json) {
              //parse through locations
              $.each(json.locations.location, function(key, data) {
                            if($('#info-'+ data.id).length != 0){
                                var newY = (100 + Math.floor((Math.random() * 100) + 1));
                                var capacity = data.capacity;
                                var gaugeValue = ((newY/capacity) * 100);
                                updateGauge('gauge-' + data.id, ((newY/capacity) * 100));
                                populateHighChart('chart-' + data.id, data.address, newY, capacity, data.histavg, data.id);    
                            }
              });
        });
}



// load default gague settings
function loadGaugeConfig(){
    config = liquidFillGaugeDefaultSettings();
    config.circleColor = "#FF7777";
    config.textColor = "#FF4444";
    config.waveTextColor = "#FFAAAA";
    config.waveColor = "#FFDDDD";
    config.circleThickness = 0.2;
    config.textVertPosition = 0.2;
    config.waveAnimateTime = 1000;  
}

//initialize maps
function initializeMaps() {
    var mapOptions = {
      zoom: 7,
      center: {lat: 36.7494314, lng: -118.3109355},
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    map = new google.maps.Map(document.getElementById('map'),mapOptions);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('legend'));
    $('#map').width($(window).width()).height($(window).height() - 200);
};


//function to populate map
function populateMap(){
    initializeMaps();
    $.getJSON("locations.json", function(json) {
          //parse through locations
          $.each(json.locations.location, function(key, data) {
            //get location from data json object - data.latitude, data.longitude
            var latLng = new google.maps.LatLng(data.latitude, data.longitude); 
            //create circle as per revenue
            var insideContent = "<div class=\"info-container text-center\" id=\"info-"+data.id+"\" > " +
                    "<div class=\"charts-wrapper\"> " +
                        "<div id=\"chart-"+data.id+"\" class=\"highchart\" data-chart=\""+data.id+"\"> " +
                        "</div>" +
                    "</div>" +
                    "<div class=\"d3-container\">" +
                    
                            "<svg id=\"gauge-"+data.id+"\" width=\"97%\" height=\"50\"></svg>" +
                    "</div>" +
                "</div>";
              overlay = new CustomMarker(latLng, map);
                var iw = new google.maps.InfoWindow({content: insideContent, pixelOffset: new google.maps.Size(6,0)});
                iw.open(map, overlay);
                google.maps.event.addListener(overlay, "click", function() {
                  iw.open(map, overlay);
                });
                overlay.setMap(map);

          });
    });
    
}



//function to populate Guages
function populateGauges(){
    $.getJSON("locations.json", function(json) {
              //parse through locations
              $.each(json.locations.location, function(key, data) {
                    var gaugeId = 'gauge-'+data.id;
                    var newY = (700 + Math.floor((Math.random() * 100) + 1));
                    var capacity = data.capacity;
                    var gaugeValue = ((newY/capacity) * 100);
                    loadLiquidFillGauge(gaugeId, gaugeValue);
              });
            
        });
    
    
}


//function to poulate gauge
function updateGauge(gaugeId, gaugeValue){
    $('#'+gaugeId).html('');
    loadLiquidFillGauge(gaugeId, gaugeValue);
}


// Function to populate charts in real-time
function populateHighChart(domId, chartTitle, reservoirValue, capacity, average, chartNumber){
    
    chart[domId] = new Highcharts.Chart({
        chart: {
            renderTo: domId,
            height: 150,
            width: 150,
            type: 'column'
        },
        title: {
            text: ''
        },
        xAxis:{
            title: {
                text: chartTitle
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                color: 'red',
                value: average, // Insert your average here
                width: '1',
                zIndex: 100 // To not get stuck below the regular plot lines
            }],
            max : capacity
        },
        legend: {
            enabled: false
        },
        series: [{
            name: chartTitle,
            data: [ reservoirValue]
        }]
        
    });
    
}

