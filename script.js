// ============================================
// JEPOY'S JBL PARTYBOX
// BOOKING + DELIVERY CALCULATOR
// SUPABASE VERSION
// ============================================


// ============================================
// BUSINESS LOCATION
// ============================================

const BUSINESS_LAT = 15.989299;
const BUSINESS_LNG = 120.2244473;


// ============================================
// SUPABASE
// ============================================

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


// ============================================
// ELEMENTS
// ============================================

const locationBtn = document.getElementById("locationBtn");
const calcBtn = document.getElementById("calc");
const bookingForm = document.getElementById("bookingForm");

const result = document.getElementById("result");

const distanceDisplay = document.getElementById("distance");
const feeDisplay = document.getElementById("fee");


// ============================================
// SAVED LOCATION
// ============================================

let customerLatitude = null;
let customerLongitude = null;
let customerDistance = null;
let customerDeliveryFee = null;


// ============================================
// CALCULATE DISTANCE
// ============================================

function calculateDistance(lat1, lon1, lat2, lon2) {

  const earthRadius = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}


// ============================================
// CALCULATE DELIVERY FEE
// ============================================
//
// 0 - 5 km       = FREE
// 5.1 - 8 km     = ₱100
// Every extra 3km = +₱50
//
// Examples:
// 5 km  = FREE
// 6 km  = ₱100
// 8 km  = ₱100
// 9 km  = ₱150
// 11 km = ₱150
// 12 km = ₱200
// ============================================

function calculateDeliveryFee(km) {

  if (km <= 5) {
    return 0;
  }

  if (km <= 8) {
    return 100;
  }

  return 100 + (Math.ceil((km - 8) / 3) * 50);
}


// ============================================
// FORMAT PESO
// ============================================

function formatPeso(amount) {

  if (amount === 0) {
    return "FREE";
  }

  return "₱" + amount.toLocaleString("en-PH");
}


// ============================================
// GET CURRENT LOCATION
// ============================================

locationBtn.addEventListener("click", () => {

  if (!navigator.geolocation) {

    result.textContent =
      "Location is not supported by your browser.";

    return;
  }


  result.textContent =
    "📍 Getting your location...";


  navigator.geolocation.getCurrentPosition(

    (position) => {

      customerLatitude = position.coords.latitude;
      customerLongitude = position.coords.longitude;


      customerDistance = calculateDistance(
        BUSINESS_LAT,
        BUSINESS_LNG,
        customerLatitude,
        customerLongitude
      );


      customerDeliveryFee =
        calculateDeliveryFee(customerDistance);


      const mapsLink =
        `https://www.google.com/maps?q=${customerLatitude},${customerLongitude}`;


      distanceDisplay.textContent =
        customerDistance.toFixed(2) + " km";


      feeDisplay.textContent =
        formatPeso(customerDeliveryFee);


      result.innerHTML = `
        📍 Location detected.<br>
        Distance: <b>${customerDistance.toFixed(2)} km</b><br>
        Delivery fee: <b>${formatPeso(customerDeliveryFee)}</b><br><br>

        <a
          href="${mapsLink}"
          target="_blank"
          rel="noopener"
        >
          Open my location in Google Maps
        </a>
      `;

    },


    (error) => {

      console.error(error);

      result.textContent =
        "❌ Unable to get your location. Please allow location access and try again.";

    },


    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0
    }

  );

});


// ============================================
// CALCULATE DELIVERY BUTTON
// ============================================

calcBtn.addEventListener("click", () => {

  if (
    customerLatitude === null ||
    customerLongitude === null
  ) {

    result.textContent =
      "📍 Please tap 'Use My Current Location' first.";

    return;
  }


  customerDistance = calculateDistance(
    BUSINESS_LAT,
    BUSINESS_LNG,
    customerLatitude,
    customerLongitude
  );


  customerDeliveryFee =
    calculateDeliveryFee(customerDistance);


  distanceDisplay.textContent =
    customerDistance.toFixed(2) + " km";


  feeDisplay.textContent =
    formatPeso(customerDeliveryFee);


  result.textContent =
    `Distance: ${customerDistance.toFixed(2)} km • Delivery: ${formatPeso(customerDeliveryFee)}`;

});


// ============================================
// BOOKING FORM
// ============================================

bookingForm.addEventListener("submit", async (event) => {

  event.preventDefault();


  // ------------------------------------------
  // GET FORM VALUES
  // ------------------------------------------

  const name =
    document.getElementById("name").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const packageName =
    document.getElementById("package").value;

  const rentalDate =
    document.getElementById("date").value;

  const address =
    document.getElementById("address").value.trim();


  // ------------------------------------------
  // CHECK LOCATION
  // ------------------------------------------

  if (
    customerLatitude === null ||
    customerLongitude === null
  ) {

    alert(
      "Please use your current location first so we can calculate the delivery distance and fee."
    );

    return;
  }


  // ------------------------------------------
  // CHECK DELIVERY
  // ------------------------------------------

  if (customerDistance === null) {

    customerDistance = calculateDistance(
      BUSINESS_LAT,
      BUSINESS_LNG,
      customerLatitude,
      customerLongitude
    );

  }


  if (customerDeliveryFee === null) {

    customerDeliveryFee =
      calculateDeliveryFee(customerDistance);

  }


  // ------------------------------------------
  // GOOGLE MAPS LINK
  // ------------------------------------------

  const mapsLink =
    `https://www.google.com/maps?q=${customerLatitude},${customerLongitude}`;


  // ------------------------------------------
  // BOOKING DATA
  // ------------------------------------------

  const bookingData = {

    // NOTE:
    // Your Supabase column is spelled
    // "costumer_name", so we use that exact name.

    costumer_name: name,

    contact_number: phone,

    package_name: packageName,

    rental_date: rentalDate,

    delivery_address: address,

    latitude: customerLatitude,

    longitude: customerLongitude,

    distance_km: Number(
      customerDistance.toFixed(2)
    ),

    delivery_fee: customerDeliveryFee,

    maps_link: mapsLink,

    status: "Pending"

  };


  // ------------------------------------------
  // DISABLE BUTTON
  // ------------------------------------------

  const submitButton =
    bookingForm.querySelector(
      'button[type="submit"]'
    );


  submitButton.disabled = true;

  submitButton.textContent =
    "Sending Booking...";


  try {

    // ----------------------------------------
    // SEND TO SUPABASE
    // ----------------------------------------

    const { data, error } =
      await supabaseClient
        .from("bookings")
        .insert([bookingData])
        .select();


    if (error) {

      console.error(
        "Supabase booking error:",
        error
      );

      alert(
        "❌ Booking could not be submitted.\n\n" +
        error.message
      );

      return;
    }


    // ----------------------------------------
    // SUCCESS
    // ----------------------------------------

    console.log(
      "Booking successfully saved:",
      data
    );


    // ----------------------------------------
    // MESSENGER MESSAGE
    // ----------------------------------------

    const message =
      `Hello JEPOY'S JBL PARTYBOX!

I would like to make a booking.

Name: ${name}

Contact Number: ${phone}

Package: ${packageName}

Rental Date: ${rentalDate}

Delivery Address: ${address}

Distance: ${customerDistance.toFixed(2)} km

Delivery Fee: ${formatPeso(customerDeliveryFee)}

Google Maps Location:
${mapsLink}

Booking Status: Pending`;


    const messengerURL =
      `https://m.me/1218332498024792?text=${encodeURIComponent(message)}`;


    alert(
      "✅ Booking request submitted successfully!\n\n" +
      "You will now be redirected to Facebook Messenger."
    );


    // ----------------------------------------
    // OPEN MESSENGER
    // ----------------------------------------

    window.open(
      messengerURL,
      "_blank"
    );


    // ----------------------------------------
    // RESET FORM
    // ----------------------------------------

    bookingForm.reset();

    customerLatitude = null;
    customerLongitude = null;
    customerDistance = null;
    customerDeliveryFee = null;

    distanceDisplay.textContent =
      "Not calculated";

    feeDisplay.textContent =
      "Not calculated";

    result.textContent =
      "Tap the button to calculate your distance.";


  } catch (error) {

    console.error(error);

    alert(
      "❌ Something went wrong while submitting your booking."
    );

  } finally {

    submitButton.disabled = false;

    submitButton.textContent =
      "Send Booking Request";

  }

});
