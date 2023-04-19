export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicnltZWxhIiwiYSI6ImNsZ2o2Zjd0YjAwZm8zZ3FzNzJ2a3g2MnoifQ.MlfIu_7sSZezmGYUs02ZPQ';

  // 2) Define new map
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/rymela/clgj89h3z006z01qx9e128675', // style URL
    scrollZoom: false,
    // maxZoom: 10,
    // center: [-122.29286, 38.294065], // starting position [lng, lat]
    // zoom: 5, // starting zoom
    // interactive: false,
  });

  // 3) Create bounds object
  const bounds = new mapboxgl.LngLatBounds();

  // 4) Create markers for all locations
  locations.forEach((loc) => {
    // 1) Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // 2) Add marker
    new mapboxgl.Marker({
      element: el,
      // bottom of el (pin) will be placed on the location
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // 3) Add label
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // 4) extend map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  // 5) Fit map to bounds and add padding
  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });

  // 6) Add zoom controls

  const controls = new mapboxgl.NavigationControl();
  map.addControl(controls, 'bottom-left');
};
