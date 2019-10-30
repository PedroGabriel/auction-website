var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: new google.maps.LatLng(-33.91722, 151.23064),
    mapTypeId: 'roadmap'
  });

  var iconBase = 'assets/images/';
  var icons = {
    parking: {
      icon: iconBase + 'marker-wt.png'
    },
    info: {
      icon: iconBase + 'marker-pk.png'
    }
  };

  var features = [
    {
      position: new google.maps.LatLng(-33.91721, 151.2263),
      type: 'parking'
    },
    {
      position: new google.maps.LatLng(-33.91529, 151.2282),
      type: 'parking'
    },
    {
      position: new google.maps.LatLng(-33.91747, 151.22912),
      type: 'parking'
    },
    {
      position: new google.maps.LatLng(-33.9191, 151.22907),
      type: 'parking'
    },
    {
      position: new google.maps.LatLng(-33.91725, 151.23011),
      type: 'parking'
    },
    {
      position: new google.maps.LatLng(-33.91872, 151.23089),
      type: 'info'
    },
    {
      position: new google.maps.LatLng(-33.91727341958453, 151.23348314155578),
      type: 'parking'
    }
  ];

  // Create markers.
  features.forEach(function(feature) {
    var marker = new google.maps.Marker({
      position: feature.position,
      icon: icons[feature.type].icon,
      map: map
    });
  });
}
