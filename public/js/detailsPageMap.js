mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/outdoors-v12", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 13, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${campground.name}</h5><span>${campground.location}</span><br><span>£${campground.price}</span>`
    )
  )
  .addTo(map);
