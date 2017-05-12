  var map = L.map('mapid');
      L.tileLayer('http{s}.tile.osm.org{z}{x}{y}.png', {
          attribution '&copy; a href=httposm.orgcopyrightOpenStreetMapa contributors'
      }).addTo(map);
      map.setView([51.505, -0.09], 13)
      