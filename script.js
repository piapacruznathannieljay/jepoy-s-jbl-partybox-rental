// ========================================
// JEPOY'S JBL PARTYBOX
// GPS + DELIVERY CALCULATOR + BOOKING
// ========================================

// ========================================
// BUSINESS LOCATION
// ========================================

const BUSINESS_LAT = 15.989299;
const BUSINESS_LNG = 120.2244473;


// ========================================
// CUSTOMER GPS
// ========================================

let customerGPS = null;


// ========================================
// CALCULATE STRAIGHT-LINE GPS DISTANCE
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

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}


// ========================================
// DELIVERY FEE
//
// 0–5 km     = FREE
// 5.01–8 km  = ₱100
// Every additional 3 km = +₱50
//
// Examples:
// 5 km  = FREE
// 6 km  = ₱100
// 8 km  = ₱100
// 9 km  = ₱150
// 11 km = ₱150
// 12 km = ₱200
// ========================================

function calculateDeliveryFee(km) {

  if (km <= 5) {
    return 0;
  }

  if (km <= 8) {
    return 100;
  }

  return (
    100 +
    Math.ceil((km - 8) / 3) * 50
  );
}


// ========================================
// FORMAT DELIVERY FEE
// ========================================

function formatFee(fee) {

  if (fee === 0) {
    return "FREE";
  }

  return "₱" + fee.toLocaleString();
}


// ========================================
// GET CUSTOMER LOCATION
// ========================================

function getCustomerLocation() {

  const result =
    document.getElementById("result");

  if (!navigator.geolocation) {

    result.textContent =
      "❌ Your browser does not support GPS.";

    return;
  }


  result.innerHTML =
    "📍 Getting your current location...";


  navigator.geolocation.getCurrentPosition(

    function(position) {

      const lat =
        position.coords.latitude;

      const lng =
        position.coords.longitude;


      // SAVE GPS
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
      // CALCULATE DISTANCE
      // ========================================

      const distance =
        calculateDistance(
          BUSINESS_LAT,
          BUSINESS_LNG,
          lat,
          lng
        );


      // ========================================
      // CALCULATE DELIVERY FEE
      // ========================================

      const fee =
        calculateDeliveryFee(distance);


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
          formatFee(fee);
      }


      // ========================================
      // SHOW RESULT
      // ========================================

      result.innerHTML =

        "📍 GPS Distance: <strong>" +
        distance.toFixed(2) +
        " km</strong><br><br>" +

        "🚚 Delivery Fee: <strong>" +
        formatFee(fee) +
        "</strong><br><br>" +

        "🗺️ <a href=\"" +
        mapsLink +
        "\" target=\"_blank\" rel=\"noopener\">" +
        "Open Your Location in Google Maps</a>";


    },


    // ========================================
    // GPS ERROR
    // ========================================

    function(error) {

      if (error.code === 1) {

        result.innerHTML =
          "❌ Location permission was denied.<br><br>" +
          "Please allow location access and try again.";

      }

      else if (error.code === 2) {

        result.innerHTML =
          "❌ Your location could not be determined.<br><br>" +
          "Please turn on Location/GPS and try again.";

      }

      else if (error.code === 3) {

        result.innerHTML =
          "❌ Getting your location took too long.<br><br>" +
          "Please try again.";

      }

      else {

        result.innerHTML =
          "❌ Unable to get your location.<br><br>" +
          "Please try again.";
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
        document.getElementById("name").value.trim();


      const phone =
        document.getElementById("phone").value.trim();


      const packageName =
        document.getElementById("package").value;


      const date =
        document.getElementById("date").value;


      const address =
        document.getElementById("address").value.trim();


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
      // BOOKING MESSAGE
      // ========================================

      const message =

        "Hello JEPOY'S JBL PARTYBOX!" +

        "\n\n" +

        "I would like to book a rental." +

        "\n\n" +

        "Name: " +
        name +

        "\n" +

        "Contact: " +
        phone +

        "\n" +

        "Package: " +
        packageName +

        "\n" +

        "Date: " +
        date +

        "\n" +

        "Delivery Address: " +
        address +

        "\n\n" +

        "📍 Delivery Distance: " +
        distance +

        "\n" +

        "🚚 Delivery Fee: " +
        fee +

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
