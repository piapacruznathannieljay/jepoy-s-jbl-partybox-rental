// ========================================
// JEPOY'S JBL PARTYBOX
// GPS + ROAD DISTANCE + DELIVERY CALCULATOR
// ========================================
const BUSINESS_LAT = 15.989299;
const BUSINESS_LNG = 120.2244473;
// ========================================
// STRAIGHT-LINE DISTANCE
// Used only as fallback if routing fails
// ========================================
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat =
    (lat2 - lat1) * Math.PI / 180;
  const dLon =
    (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );
}
// ========================================
// GET ROAD DISTANCE
// ========================================
//
// Uses OSRM routing to calculate
// actual driving distance along roads.
//
// Result is returned in kilometers.
//
async function calculateRoadDistance(
  customerLat,
  customerLng
) {
  const url =
    "https://router.project-osrm.org/route/v1/driving/" +
    BUSINESS_LNG + "," + BUSINESS_LAT +
    ";" +
    customerLng + "," + customerLat +
    "?overview=false";
  const response =
    await fetch(url);
  if (!response.ok) {
    throw new Error(
      "Unable to calculate road distance."
    );
  }
  const data =
    await response.json();
  if (
    data.code !== "Ok" ||
    !data.routes ||
    !data.routes.length
  ) {
    throw new Error(
      "No driving route found."
    );
  }
  // OSRM returns meters
  const distanceKm =
    data.routes[0].distance / 1000;
  return distanceKm;
}
// ========================================
// DELIVERY FEE
// ========================================
//
// 0–5 km     = FREE
// 5–8 km     = ₱100
// Every additional 3 km = +₱50
//
// Examples:
//
// 5 km  = FREE
// 6 km  = ₱100
// 8 km  = ₱100
// 9 km  = ₱150
// 11 km = ₱150
// 12 km = ₱200
//
function calculateDeliveryFee(km) {
  if (km <= 5) {
    return 0;
  }
  if (km <= 8) {
    return 100;
  }
  return 100 +
    Math.ceil((km - 8) / 3) * 50;
}
// ========================================
// CUSTOMER GPS
// ========================================
let customerGPS = null;
// ========================================
// GET CUSTOMER LOCATION
// ========================================
async function getCustomerLocation() {
  const result =
    document.getElementById("result");
  if (!navigator.geolocation) {
result.textContent =
  "Your browser does not support GPS.";

return;

  }
  result.textContent =
    "📍 Getting your GPS location...";
  navigator.geolocation.getCurrentPosition(
async function(position) {

  const lat =
    position.coords.latitude;

  const lng =
    position.coords.longitude;


  // ========================================
  // SAVE GPS
  // ========================================

  customerGPS = {
    lat: lat,
    lng: lng
  };


  // ========================================
  // GOOGLE MAPS LINK
  // ========================================

  const mapsLink =
    "https://www.google.com/maps?q=" +
    lat +
    "," +
    lng;


  // ========================================
  // SHOW CALCULATING MESSAGE
  // ========================================

  result.innerHTML =
    "📍 Location found.<br><br>" +
    "🚗 Calculating driving distance...";


  let distance;


  // ========================================
  // CALCULATE ROAD DISTANCE
  // ========================================

  try {

    distance =
      await calculateRoadDistance(
        lat,
        lng
      );

  }

  catch (error) {

    console.error(
      "Road distance error:",
      error
    );


    // ========================================
    // FALLBACK
    // ========================================

    distance =
      calculateDistance(
        BUSINESS_LAT,
        BUSINESS_LNG,
        lat,
        lng
      );


    result.innerHTML =
      "⚠️ Road distance could not be calculated.<br>" +
      "Using straight-line distance instead.<br><br>";
  }


  // ========================================
  // ROUND DISTANCE
  // ========================================

  distance =
    Number(distance.toFixed(2));


  // ========================================
  // CALCULATE DELIVERY FEE
  // ========================================

  const fee =
    calculateDeliveryFee(distance);


  // ========================================
  // DISPLAY RESULT
  // ========================================

  result.innerHTML =

    "📍 Distance: <strong>" +
    distance.toFixed(2) +
    " km</strong><br><br>" +

    "🚚 Delivery Fee: <strong>" +
    (
      fee === 0
        ? "FREE"
        : "₱" + fee.toLocaleString()
    ) +
    "</strong><br><br>" +

    "🗺️ <a href=\"" +
    mapsLink +
    "\" target=\"_blank\">" +
    "Open Customer Location in Google Maps</a>";


  // ========================================
  // UPDATE DISTANCE
  // ========================================

  const distanceElement =
    document.getElementById("distance");


  if (distanceElement) {

    distanceElement.textContent =
      distance.toFixed(2) + " km";
  }


  // ========================================
  // UPDATE FEE
  // ========================================

  const feeElement =
    document.getElementById("fee");


  if (feeElement) {

    feeElement.textContent =
      fee === 0
        ? "FREE"
        : "₱" + fee.toLocaleString();
  }

},


// ========================================
// GPS ERROR
// ========================================

function(error) {

  if (error.code === 1) {

    result.textContent =
      "❌ Location permission denied. " +
      "Please allow location access.";

  }

  else if (error.code === 2) {

    result.textContent =
      "❌ Location unavailable. " +
      "Please turn on Location and try again.";

  }

  else if (error.code === 3) {

    result.textContent =
      "❌ Location request timed out. " +
      "Please try again.";

  }

  else {

    result.textContent =
      "❌ Unable to get GPS location. " +
      "Please turn on Location and try again.";
  }

},


// ========================================
// GPS SETTINGS
// ========================================

{
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 0
}

  );
}
// ========================================
// LOCATION BUTTON
// ========================================
const locationButton =
  document.getElementById("locationBtn");
if (locationButton) {
  locationButton.addEventListener(
    "click",
    getCustomerLocation
  );
}
// ========================================
// CALCULATE BUTTON
// ========================================
const calculateButton =
  document.getElementById("calc");
if (calculateButton) {
  calculateButton.addEventListener(
    "click",
    getCustomerLocation
  );
}
// ========================================
// BOOKING FORM
// ========================================
const bookingForm =
  document.getElementById("bookingForm");
if (bookingForm) {
  bookingForm.addEventListener(
    "submit",
    function(event) {
  event.preventDefault();


  // ========================================
  // MAKE SURE GPS WAS SELECTED
  // ========================================

  if (!customerGPS) {

    alert(
      "Please tap 'Use My Current Location' first."
    );

    return;
  }


  // ========================================
  // GET FORM INFORMATION
  // ========================================

  const name =
    document.getElementById("name").value;


  const phone =
    document.getElementById("phone").value;


  const packageName =
    document.getElementById("package").value;


  const date =
    document.getElementById("date").value;


  const address =
    document.getElementById("address").value;


  const distance =
    document.getElementById("distance").textContent;


  const fee =
    document.getElementById("fee").textContent;


  // ========================================
  // CUSTOMER GOOGLE MAPS LINK
  // ========================================

  const customerMapsLink =
    "https://www.google.com/maps?q=" +
    customerGPS.lat +
    "," +
    customerGPS.lng;


  // ========================================
  // MESSENGER MESSAGE
  // ========================================

  const message =

    "Hello JEPOY'S JBL PARTYBOX!" +
    "\n\n" +

    "I would like to book a rental." +
    "\n\n" +

    "Name: " + name +
    "\n" +

    "Contact: " + phone +
    "\n" +

    "Package: " + packageName +
    "\n" +

    "Date: " + date +
    "\n" +

    "Delivery Address: " + address +
    "\n\n" +

    "📍 Delivery Distance: " + distance +
    "\n" +

    "🚚 Delivery Fee: " + fee +
    "\n\n" +

    "🗺️ GOOGLE MAPS CUSTOMER LOCATION:" +
    "\n" +

    customerMapsLink;


  // ========================================
  // OPEN MESSENGER
  // ========================================

  const messengerURL =
    "https://m.me/1218332498024792?text=" +
    encodeURIComponent(message);


  window.open(
    messengerURL,
    "_blank"
  );

}

  );
}
