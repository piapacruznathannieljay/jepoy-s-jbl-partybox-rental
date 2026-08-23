// ========================================
// JEPOY'S JBL PARTYBOX
// GPS + ROAD DISTANCE + DELIVERY
// BOOKING + SUPABASE
// ========================================

// ========================================
// BUSINESS LOCATION
// X6QF+PQW Bugallon, Pangasinan
// ========================================

const BUSINESS_LAT = 15.989299;
const BUSINESS_LNG = 120.2244473;


// ========================================
// SUPABASE
// ========================================

let supabaseClient = null;

function initializeSupabase() {

  if (
    typeof window.supabase === "undefined"
  ) {
    console.error("Supabase library not loaded.");
    return;
  }

  if (
    typeof SUPABASE_URL === "undefined" ||
    typeof SUPABASE_ANON_KEY === "undefined"
  ) {
    console.error(
      "SUPABASE_URL or SUPABASE_ANON_KEY is missing from config.js"
    );
    return;
  }

  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );
}

initializeSupabase();


// ========================================
// STRAIGHT-LINE DISTANCE
// ========================================

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371;

  const dLat =
    (lat2 - lat1) *
    Math.PI / 180;

  const dLon =
    (lon2 - lon1) *
    Math.PI / 180;

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
// ROAD DISTANCE
// ========================================

async function calculateRoadDistance(
  customerLat,
  customerLng
) {

  const url =
    "https://router.project-osrm.org/route/v1/driving/" +
    BUSINESS_LNG +
    "," +
    BUSINESS_LAT +
    ";" +
    customerLng +
    "," +
    customerLat +
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

  return data.routes[0].distance / 1000;
}


// ========================================
// DELIVERY FEE
// ========================================
//
// 0–5 km = FREE
// 5.01–8 km = ₱100
// Every additional 3 km = +₱50
//

function calculateDeliveryFee(km) {

  if (km <= 5) {
    return 0;
  }

  if (km <= 8) {
    return 100;
  }

  return (
    100 +
    Math.ceil(
      (km - 8) / 3
    ) * 50
  );
}


// ========================================
// CUSTOMER GPS
// ========================================

let customerGPS = null;

let currentDistance = null;

let currentDeliveryFee = null;

let currentMapsLink = null;


// ========================================
// GET CUSTOMER LOCATION
// ========================================

async function getCustomerLocation() {

  const result =
    document.getElementById("result");

  const distanceElement =
    document.getElementById("distance");

  const feeElement =
    document.getElementById("fee");


  if (!navigator.geolocation) {

    result.textContent =
      "❌ Your browser does not support GPS.";

    return;
  }


  result.textContent =
    "📍 Getting your current location...";


  navigator.geolocation.getCurrentPosition(

    async function(position) {

      const lat =
        position.coords.latitude;

      const lng =
        position.coords.longitude;


      // Save GPS

      customerGPS = {
        lat: lat,
        lng: lng
      };


      // Google Maps link

      currentMapsLink =
        "https://www.google.com/maps?q=" +
        lat +
        "," +
        lng;


      result.innerHTML =
        "📍 Location found.<br><br>" +
        "🚗 Calculating driving distance...";


      let distance;


      // Try road distance

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


        // Fallback

        distance =
          calculateDistance(
            BUSINESS_LAT,
            BUSINESS_LNG,
            lat,
            lng
          );


        result.innerHTML =
          "⚠️ Road distance unavailable.<br>" +
          "Using straight-line distance instead.<br><br>" +
          "Calculating delivery fee...";
      }


      distance =
        Number(
          distance.toFixed(2)
        );


      // Calculate fee

      const fee =
        calculateDeliveryFee(
          distance
        );


      currentDistance =
        distance;

      currentDeliveryFee =
        fee;


      // Update summary

      if (distanceElement) {

        distanceElement.textContent =
          distance.toFixed(2) +
          " km";
      }


      if (feeElement) {

        feeElement.textContent =
          fee === 0
            ? "FREE"
            : "₱" +
              fee.toLocaleString();
      }


      // Show result

      result.innerHTML =

        "📍 Distance: <strong>" +
        distance.toFixed(2) +
        " km</strong><br><br>" +

        "🚚 Delivery Fee: <strong>" +
        (
          fee === 0
            ? "FREE"
            : "₱" +
              fee.toLocaleString()
        ) +
        "</strong><br><br>" +

        "🗺️ <a href=\"" +
        currentMapsLink +
        "\" target=\"_blank\">" +
        "Open Customer Location in Google Maps" +
        "</a>";

    },


    // ====================================
    // GPS ERROR
    // ====================================

    function(error) {

      console.error(
        "GPS error:",
        error
      );


      if (error.code === 1) {

        result.textContent =
          "❌ Location permission denied. " +
          "Please allow location access for this website.";

      }

      else if (error.code === 2) {

        result.textContent =
          "❌ Location unavailable. " +
          "Turn on Location/GPS and try again.";

      }

      else if (error.code === 3) {

        result.textContent =
          "❌ Location request timed out. " +
          "Please try again.";

      }

      else {

        result.textContent =
          "❌ Unable to get your location. " +
          "Please try again.";
      }

    },


    // ====================================
    // GPS SETTINGS
    // ====================================

    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    }

  );
}


// ========================================
// LOCATION BUTTON
// ========================================

const locationButton =
  document.getElementById(
    "locationBtn"
  );

if (locationButton) {

  locationButton.addEventListener(
    "click",
    function() {

      getCustomerLocation();

    }
  );

}


// ========================================
// CALCULATE BUTTON
// ========================================

const calculateButton =
  document.getElementById(
    "calc"
  );

if (calculateButton) {

  calculateButton.addEventListener(
    "click",
    function() {

      getCustomerLocation();

    }
  );

}


// ========================================
// BOOKING FORM
// ========================================

const bookingForm =
  document.getElementById(
    "bookingForm"
  );


if (bookingForm) {

  bookingForm.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();


      // ==================================
      // CHECK GPS
      // ==================================

      if (!customerGPS) {

        alert(
          "Please tap 'Use My Current Location' first."
        );

        return;
      }


      // ==================================
      // CHECK DELIVERY CALCULATION
      // ==================================

      if (
        currentDistance === null ||
        currentDeliveryFee === null
      ) {

        alert(
          "Please calculate your delivery first."
        );

        return;
      }


      // ==================================
      // CHECK SUPABASE
      // ==================================

      if (!supabaseClient) {

        alert(
          "Supabase is not connected. " +
          "Please check config.js."
        );

        console.error(
          "Supabase client is not initialized."
        );

        return;
      }


      // ==================================
      // GET FORM VALUES
      // ==================================

      const name =
        document
          .getElementById("name")
          .value
          .trim();


      const phone =
        document
          .getElementById("phone")
          .value
          .trim();


      const packageName =
        document
          .getElementById("package")
          .value;


      const date =
        document
          .getElementById("date")
          .value;


      const address =
        document
          .getElementById("address")
          .value
          .trim();


      // ==================================
      // VALIDATION
      // ==================================

      if (
        !name ||
        !phone ||
        !packageName ||
        !date ||
        !address
      ) {

        alert(
          "Please complete all booking fields."
        );

        return;
      }


      // ==================================
      // GOOGLE MAPS
      // ==================================

      const mapsLink =
        currentMapsLink ||
        (
          "https://www.google.com/maps?q=" +
          customerGPS.lat +
          "," +
          customerGPS.lng
        );


      // ==================================
      // DISABLE BUTTON
      // ==================================

      const submitButton =
        bookingForm.querySelector(
          'button[type="submit"]'
        );


      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.textContent =
          "Sending Booking...";
      }


      try {

        // ==================================
        // SEND TO SUPABASE
        // ==================================

        const { data, error } =
          await supabaseClient
            .from("bookings")
            .insert([
              {
                customer_name: name,
                contact_number: phone,
                package_name: packageName,
                rental_date: date,
                delivery_address: address,
                latitude: customerGPS.lat,
                longitude: customerGPS.lng,
                distance_km: currentDistance,
                delivery_fee: currentDeliveryFee,
                maps_link: mapsLink,
                status: "pending"
              }
            ])
            .select();


        // ==================================
        // SUPABASE ERROR
        // ==================================

        if (error) {

          console.error(
            "Supabase booking error:",
            error
          );

          alert(
            "❌ Booking could not be saved.\n\n" +
            error.message
          );

          return;
        }


        // ==================================
        // SUCCESS
        // ==================================

        console.log(
          "Booking saved:",
          data
        );


        alert(
          "✅ Booking request sent successfully!\n\n" +
          "Your booking has been recorded."
        );


        // ==================================
        // MESSENGER MESSAGE
        // ==================================

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
          currentDistance.toFixed(2) +
          " km" +
          "\n" +

          "🚚 Delivery Fee: " +
          (
            currentDeliveryFee === 0
              ? "FREE"
              : "₱" +
                currentDeliveryFee.toLocaleString()
          ) +
          "\n\n" +

          "🗺️ CUSTOMER LOCATION:" +
          "\n" +

          mapsLink;


        const messengerURL =
          "https://m.me/1218332498024792?text=" +
          encodeURIComponent(
            message
          );


        // Open Messenger

        window.open(
          messengerURL,
          "_blank"
        );


        // ==================================
        // RESET FORM
        // ==================================

        bookingForm.reset();


        customerGPS =
          null;

        currentDistance =
          null;

        currentDeliveryFee =
          null;

        currentMapsLink =
          null;


        document
          .getElementById("distance")
          .textContent =
          "Not calculated";


        document
          .getElementById("fee")
          .textContent =
          "Not calculated";


        document
          .getElementById("result")
          .textContent =
          "Booking sent successfully.";

      }

      catch (error) {

        console.error(
          "Unexpected booking error:",
          error
        );

        alert(
          "❌ Something went wrong while sending the booking.\n\n" +
          error.message
        );

      }

      finally {

        if (submitButton) {

          submitButton.disabled =
            false;

          submitButton.textContent =
            "Send Booking Request";
        }

      }

    }
  );

}


// ========================================
// SET MINIMUM RENTAL DATE
// ========================================

const dateInput =
  document.getElementById(
    "date"
  );


if (dateInput) {

  const today =
    new Date();


  const year =
    today.getFullYear();


  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");


  const day =
    String(
      today.getDate()
    ).padStart(2, "0");


  dateInput.min =
    year +
    "-" +
    month +
    "-" +
    day;
}


// ========================================
// PWA SERVICE WORKER
// ========================================

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    function() {

      navigator.serviceWorker
        .register("sw.js")
        .then(function() {

          console.log(
            "JEPOY'S app service worker registered."
          );

        })
        .catch(function(error) {

          console.error(
            "Service worker registration failed:",
            error
          );

        });

    }
  );

}
