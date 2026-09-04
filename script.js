document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // BUSINESS LOCATION
  // =====================================================

  const BUSINESS_LAT = 15.989299;
  const BUSINESS_LNG = 120.2244473;


  // =====================================================
  // ELEMENTS
  // =====================================================

  const bookingForm = document.getElementById("bookingForm");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const packageInput = document.getElementById("package");
  const dateInput = document.getElementById("date");
  const addressInput = document.getElementById("address");

  const locationBtn = document.getElementById("locationBtn");
  const calculateBtn = document.getElementById("calc");
  const submitBtn = document.getElementById("submitBooking");

  const distanceDisplay = document.getElementById("distance");
  const feeDisplay = document.getElementById("fee");
  const resultDisplay = document.getElementById("result");


  // =====================================================
  // GET TODAY - PHILIPPINES LOCAL DATE
  // =====================================================

  function getTodayLocalDate() {

    const now = new Date();

    const year = now.getFullYear();

    const month = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      now.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  // =====================================================
  // SET DATE LIMIT
  // =====================================================

  function setDateLimit() {

    const today = getTodayLocalDate();

    dateInput.setAttribute(
      "min",
      today
    );

    /*
    If an old date is currently selected,
    immediately remove it.
    */

    if (
      dateInput.value &&
      dateInput.value < today
    ) {

      dateInput.value = "";

    }

    console.log(
      "Minimum booking date:",
      today
    );
  }


  // Set immediately
  setDateLimit();


  // =====================================================
  // DATE VALIDATION
  // =====================================================

  function validateBookingDate() {

    const today = getTodayLocalDate();

    const selectedDate = dateInput.value;


    // No date
    if (!selectedDate) {

      alert(
        "Please select a rental date."
      );

      return false;
    }


    // PAST DATE
    if (selectedDate < today) {

      alert(
        "❌ This date has already passed.\n\n" +
        "Please select September 4, 2026 or a later date."
      );

      // Remove invalid date
      dateInput.value = "";

      // Re-apply minimum
      dateInput.setAttribute(
        "min",
        today
      );

      return false;
    }


    return true;
  }


  // =====================================================
  // EXTRA PROTECTION WHEN DATE CHANGES
  // =====================================================

  dateInput.addEventListener(
    "change",
    () => {

      const today = getTodayLocalDate();

      if (
        dateInput.value &&
        dateInput.value < today
      ) {

        alert(
          "❌ You cannot select a past date."
        );

        dateInput.value = "";

        dateInput.setAttribute(
          "min",
          today
        );

      }

    }
  );


  // Also check whenever the date input receives input
  dateInput.addEventListener(
    "input",
    () => {

      const today = getTodayLocalDate();

      if (
        dateInput.value &&
        dateInput.value < today
      ) {

        dateInput.value = "";

      }

    }
  );


  // =====================================================
  // HAVERSINE DISTANCE
  // =====================================================

  function calculateDistanceKm(
    lat1,
    lon1,
    lat2,
    lon2
  ) {

    const earthRadius = 6371;

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

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadius * c;
  }


  // =====================================================
  // DELIVERY FEE
  // =====================================================

  function calculateDeliveryFee(distanceKm) {

    if (distanceKm <= 5) {

      return 0;

    }

    if (distanceKm <= 8) {

      return 100;

    }

    const additionalKm =
      distanceKm - 8;

    const additionalBlocks =
      Math.ceil(
        additionalKm / 3
      );

    return 100 +
      additionalBlocks * 50;
  }


  // =====================================================
  // PESO FORMAT
  // =====================================================

  function formatPeso(amount) {

    return "₱" +
      Number(amount).toLocaleString(
        "en-PH"
      );
  }


  // =====================================================
  // LOCATION VARIABLES
  // =====================================================

  let customerLatitude = null;
  let customerLongitude = null;

  let calculatedDistanceKm = null;
  let calculatedDeliveryFee = null;

  let googleMapsLink = "";


  // =====================================================
  // UPDATE LOCATION
  // =====================================================

  function updateLocationDisplay(
    latitude,
    longitude
  ) {

    customerLatitude = latitude;
    customerLongitude = longitude;

    calculatedDistanceKm =
      calculateDistanceKm(
        BUSINESS_LAT,
        BUSINESS_LNG,
        latitude,
        longitude
      );

    calculatedDistanceKm =
      Number(
        calculatedDistanceKm.toFixed(2)
      );

    calculatedDeliveryFee =
      calculateDeliveryFee(
        calculatedDistanceKm
      );

    googleMapsLink =
      `https://www.google.com/maps?q=${latitude},${longitude}`;


    distanceDisplay.textContent =
      `${calculatedDistanceKm.toFixed(2)} km`;


    feeDisplay.textContent =
      calculatedDeliveryFee === 0
        ? "FREE"
        : formatPeso(
            calculatedDeliveryFee
          );


    resultDisplay.innerHTML =
      `
      📍 Location detected.<br>
      Distance:
      <b>${calculatedDistanceKm.toFixed(2)} km</b><br>
      Delivery fee:
      <b>${
        calculatedDeliveryFee === 0
          ? "FREE"
          : formatPeso(calculatedDeliveryFee)
      }</b>
      `;
  }


  // =====================================================
  // GPS
  // =====================================================

  function getCurrentLocation() {

    if (!navigator.geolocation) {

      alert(
        "❌ Your browser does not support location services."
      );

      return;
    }


    locationBtn.disabled = true;

    locationBtn.textContent =
      "📍 Getting Location...";


    navigator.geolocation.getCurrentPosition(

      position => {

        updateLocationDisplay(
          position.coords.latitude,
          position.coords.longitude
        );

        locationBtn.disabled = false;

        locationBtn.textContent =
          "📍 Location Detected";
      },


      error => {

        console.error(
          "GPS ERROR:",
          error
        );

        locationBtn.disabled = false;

        locationBtn.textContent =
          "📍 Use My Current Location";


        let message =
          "Unable to get your location.";


        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {

          message =
            "❌ Location permission was denied. Please allow location access for this website.";

        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {

          message =
            "❌ Your location is currently unavailable.";

        } else if (
          error.code ===
          error.TIMEOUT
        ) {

          message =
            "❌ Location request timed out. Please try again.";
        }


        alert(message);
      },


      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }

    );
  }


  // =====================================================
  // LOCATION BUTTON
  // =====================================================

  locationBtn.addEventListener(
    "click",
    getCurrentLocation
  );


  // =====================================================
  // CALCULATE DELIVERY
  // =====================================================

  calculateBtn.addEventListener(
    "click",
    () => {

      if (
        customerLatitude === null ||
        customerLongitude === null
      ) {

        alert(
          "📍 Please use your current location first."
        );

        return;
      }


      updateLocationDisplay(
        customerLatitude,
        customerLongitude
      );

    }
  );


  // =====================================================
  // FORM SUBMIT
  // =====================================================

  bookingForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      // -----------------------------------------------
      // DATE CHECK FIRST
      // -----------------------------------------------

      if (
        !validateBookingDate()
      ) {

        return;

      }


      // -----------------------------------------------
      // LOCATION CHECK
      // -----------------------------------------------

      if (
        customerLatitude === null ||
        customerLongitude === null
      ) {

        alert(
          "📍 Please use your current location before sending the booking."
        );

        return;
      }


      // -----------------------------------------------
      // DELIVERY CHECK
      // -----------------------------------------------

      if (
        calculatedDistanceKm === null ||
        calculatedDeliveryFee === null
      ) {

        alert(
          "Please calculate your delivery first."
        );

        return;
      }


      // -----------------------------------------------
      // SUPABASE CHECK
      // -----------------------------------------------

      if (
        typeof supabaseClient ===
        "undefined"
      ) {

        alert(
          "❌ Supabase is not configured.\n\nPlease check your config.js file."
        );

        return;
      }


      // -----------------------------------------------
      // FORM VALUES
      // -----------------------------------------------

      const customerName =
        nameInput.value.trim();

      const contactNumber =
        phoneInput.value.trim();

      const packageName =
        packageInput.value.trim();

      const rentalDate =
        dateInput.value;

      const deliveryAddress =
        addressInput.value.trim();


      // -----------------------------------------------
      // FINAL DATE CHECK
      // -----------------------------------------------

      const today =
        getTodayLocalDate();


      if (
        rentalDate < today
      ) {

        alert(
          "❌ Booking rejected.\n\n" +
          "You selected a date that has already passed."
        );

        dateInput.value = "";

        return;
      }


      // -----------------------------------------------
      // DISABLE BUTTON
      // -----------------------------------------------

      submitBtn.disabled = true;

      submitBtn.textContent =
        "Sending Booking...";


      // -----------------------------------------------
      // BOOKING DATA
      // -----------------------------------------------

      const bookingData = {

        costumer_name:
          customerName,

        contact_number:
          contactNumber,

        package_name:
          packageName,

        rental_date:
          rentalDate,

        delivery_address:
          deliveryAddress,

        latitude:
          customerLatitude,

        longitude:
          customerLongitude,

        distance_km:
          calculatedDistanceKm,

        delivery_fee:
          calculatedDeliveryFee,

        maps_link:
          googleMapsLink,

        status:
          "Pending"

      };


      console.log(
        "Submitting booking:",
        bookingData
      );


      // -----------------------------------------------
      // SUPABASE INSERT
      // -----------------------------------------------

      try {

        const {
          data,
          error
        } =
          await supabaseClient
            .from("bookings")
            .insert([
              bookingData
            ])
            .select();


        if (error) {

          console.error(
            "SUPABASE ERROR:",
            error
          );

          throw new Error(
            error.message
          );
        }


        console.log(
          "BOOKING SAVED:",
          data
        );


        // ---------------------------------------------
        // SUCCESS
        // ---------------------------------------------

        alert(
          "✅ BOOKING SUCCESSFUL!\n\n" +
          "Your booking request has been received.\n\n" +
          "Status: Pending\n\n" +
          "JEPOY'S JBL PARTYBOX will contact you shortly to confirm your booking."
        );


        submitBtn.textContent =
          "Booking Sent ✓";


        // ---------------------------------------------
        // MESSENGER MESSAGE
        // ---------------------------------------------

        const messengerMessage =
          `Hello JEPOY'S JBL PARTYBOX!\n\n` +

          `I would like to make a booking.\n\n` +

          `Name: ${customerName}\n` +

          `Contact: ${contactNumber}\n` +

          `Package: ${packageName}\n` +

          `Date: ${rentalDate}\n` +

          `Address: ${deliveryAddress}\n` +

          `Distance: ${calculatedDistanceKm} km\n` +

          `Delivery Fee: ${
            calculatedDeliveryFee === 0
              ? "FREE"
              : formatPeso(
                  calculatedDeliveryFee
                )
          }\n\n` +

          `Google Maps Location:\n` +

          googleMapsLink;


        const messengerURL =
          "https://m.me/1218332498024792?text=" +
          encodeURIComponent(
            messengerMessage
          );


        const sendMessenger =
          confirm(
            "Would you also like to send the booking details through Facebook Messenger?"
          );


        if (sendMessenger) {

          window.open(
            messengerURL,
            "_blank"
          );

        }


        // ---------------------------------------------
        // RESET
        // ---------------------------------------------

        bookingForm.reset();

        customerLatitude = null;
        customerLongitude = null;

        calculatedDistanceKm = null;
        calculatedDeliveryFee = null;

        googleMapsLink = "";


        distanceDisplay.textContent =
          "Not calculated";

        feeDisplay.textContent =
          "Not calculated";

        resultDisplay.textContent =
          "Tap the button to calculate your distance.";


        // Reapply today's date limit
        setDateLimit();


      } catch (error) {

        console.error(
          "BOOKING ERROR:",
          error
        );


        let message =
          error.message ||
          "Unknown error";


        if (
          message
            .toLowerCase()
            .includes(
              "failed to fetch"
            )
        ) {

          message =
            "The website could not connect to Supabase.\n\n" +
            "Check your Supabase URL, API key, internet connection, and Supabase settings.";

        }


        alert(
          "❌ Booking could not be saved.\n\n" +
          message
        );


        submitBtn.disabled =
          false;

        submitBtn.textContent =
          "Send Booking Request";

      }

    }
  );


  // =====================================================
  // REFRESH DATE WHEN PAGE BECOMES ACTIVE
  // =====================================================

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        setDateLimit();

      }

    }
  );


  console.log(
    "JEPOY'S JBL PARTYBOX booking system ready."
  );

});
