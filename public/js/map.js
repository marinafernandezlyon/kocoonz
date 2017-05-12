 var map = L.map('mapid');
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
 
  
  var lon;
  var lat;
  $(".home").each(function(index) {

    if($(this).data("lon") > 0 && $(this).data("lat") > 0) {
        
     if(lon == undefined && lat == undefined){
        lon = $(this).data("lon");
        lat = $(this).data("lat");
       
      }
     
      L.marker([$(this).data("lat"), $(this).data("lon")]).addTo(map);
    }
  });
    
  map.setView([lat, lon], 13)  
      