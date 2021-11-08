/* eslint-disable */

export const displayMap = locations => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiYmFsYXlvZ2VzaDIwMDAiLCJhIjoiY2t0emY0MHVtMXV2dDJwbXJhNHpjbjdsdSJ9.RJGVTZUulmDU3gOt1HNU2g";
  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/balayogesh2000/cktzgv6m30tfg17p4f7pkbbm6",
    scrollZoom: false
    // center: [-118.157287, 34.111954],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create Marker
    const el = document.createElement("div");
    el.className = "marker";

    // Add Marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom"
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    // Add Popup

    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
