/*
=========================================================
JEPOY'S JBL PARTYBOX
BOOKING SYSTEM
=========================================================
*/


document.addEventListener("DOMContentLoaded", () => {

  console.log("JEPOY'S JBL PARTYBOX booking system loaded.");

  /*
  ========================================================
  BUSINESS LOCATION
  ========================================================
  */

  const BUSINESS_LAT = 15.989299;
  const BUSINESS_LNG = 120.2244473;


  /*
  ========================================================
  ELEMENTS
  ========================================================
  */

  const bookingForm =
    document.getElementById("bookingForm");

  const nameInput =
    document.getElementById("name");

  const phoneInput =
    document.getElementById("phone");

  const packageInput =
    document.getElementById("package");

  const dateInput =
    document.getElementById("date");

  const addressInput =
    document.getElementById("address");

  const locationBtn =
    document.getElementById("locationBtn");

  const calculateBtn =
    document.getElementById("calc");

  const submitBtn =
    document.getElementById("submitBooking");

  const distanceDisplay =
    document.getElementById("distance");

  const feeDisplay =
    document.getElementById("fee");

  const resultDisplay =
    document.getElementById("result");


  /*
  ========================================================
  TODAY'S DATE
  ========================================================
  */

  function getTodayLocalDate() {

    const now = new Date();

    const year =
      now.getFullYear();

    const month =
      String(now.getMonth() + 1)
        .padStart(2, "0");

    const day =
      String(now.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  /*
  ========================================================
  PREVENT PAST DATES
  ========================================================
  */

  const today =
    getTodayLocalDate();

  dateInput.min = today;

  /*
  If an old date is already inside the field,
  remove it.
  */

  if (
    dateInput.value &&
    dateInput.value < today
  ) {
    dateInput.value = "";
  }


  /*
  ========================================================
  CHECK DATE
  ========================================================
  */

  function isValidDate() {

    if (!dateInput.value) {
      alert("Please select a rental date.");
      return false;
    }

    const today =
      getTodayLocalDate();

    if (dateInput.value < today) {

      alert(
        "❌ You cannot book a date that has already passed."
      );

      dateInput.value = "";

      return false;
    }

    return true;
  }


  /*
  ========================================================
  HAVERSINE DISTANCE
  ========================================================
  */

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
      Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +

      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *

      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadius * c;
  }


  /*
  ========================================================
  DELIVERY FEE
  ========================================================
  
  0 - 5 km       = FREE
  5.01 - 8 km    = ₱100
  Above 8 km     = +₱50 every additional 3 km

  ========================================================
  */

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
      Math.ceil(additionalKm / 3);

    return 100 +
      (additionalBlocks * 50);
  }


  /*
  ========================================================
  FORMAT PESO
  ========================================================
  */

  function formatPeso(amount) {

    return "₱" +
      Number(amount).toLocaleString(
        "en-PH"
      );
  }


  /*
  ========================================================
  GPS DATA
  ========================================================
  */

  let customerLatitude = null;
  let customerLongitude = null;

  let calculatedDistanceKm = null;
  let calculatedDeliveryFee = null;

  let googleMapsLink = "";


  /*
  ========================================================
  UPDATE LOCATION DISPLAY
  ========================================================
  */

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


    /*
    UPDATE SCREEN
    */

    distanceDisplay.textContent =
      `${calculatedDistanceKm.toFixed(2)} km`;


    if (
      calculatedDeliveryFee === 0
    ) {

      feeDisplay.textContent =
        "FREE";

    } else {

      feeDisplay.textContent =
        formatPeso(
          calculatedDeliveryFee
        );
    }


    resultDisplay.innerHTML =
      `
      📍 Location detected.<br>
      Distance: <b>${calculatedDistanceKm.toFixed(2)} km</b><br>
      Delivery fee: <b>${
        calculatedDeliveryFee === 0
          ? "FREE"
          : formatPeso(calculatedDeliveryFee)
      }</b>
      `;
  }


  /*
  ========================================================
  GET CURRENT LOCATION
  ========================================================
  */

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

      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;


        updateLocationDisplay(
          latitude,
          longitude
        );


        locationBtn.disabled = false;

        locationBtn.textContent =
          "📍 Location Detected";
      },


      (error) => {

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
            "❌ Location permission was denied. Please allow location access for this website in your browser settings.";

        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {

          message =
            "❌ Your location is currently unavailable. Make sure GPS/location is turned on.";

        } else if (
          error.code ===
          error.TIMEOUT
        ) {

          message =
            "❌ Getting your location took too long. Please try again.";

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


  /*
  ========================================================
  LOCATION BUTTON
  ========================================================
  */

  locationBtn.addEventListener(
    "click",
    getCurrentLocation
  );


  /*
  ========================================================
  CALCULATE DELIVERY BUTTON
  ========================================================
  */

  calculateBtn.addEventListener(
    "click",
    () => {

      if (
        customerLatitude === null ||
        customerLongitude === null
      ) {

        alert(
          "📍 Please use the 'Use My Current Location' button first."
        );

        return;
      }


      updateLocationDisplay(
        customerLatitude,
        customerLongitude
      );

    }
  );


  /*
  ========================================================
  DATE CHANGE
  ========================================================
  */

  dateInput.addEventListener(
    "change",
    () => {

      isValidDate();

    }
  );


  /*
  ========================================================
  SUBMIT BOOKING
  ========================================================
  */

  bookingForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      /*
      Prevent double clicking
      */

      if (
        submitBtn.disabled
      ) {
        return;
      }


      /*
      Validate date
      */

      if (!isValidDate()) {
        return;
      }


      /*
      Validate location
      */

      if (
        customerLatitude === null ||
        customerLongitude === null
      ) {

        alert(
          "📍 Please use your current location before sending the booking."
        );

        return;
      }


      /*
      Validate delivery calculation
      */

      if (
        calculatedDistanceKm === null ||
        calculatedDeliveryFee === null
      ) {

        alert(
          "Please calculate the delivery first."
        );

        return;
      }


      /*
      Validate Supabase configuration
      */

      if (
        typeof supabaseClient ===
        "undefined"
      ) {

        alert(
          "❌ Supabase is not configured. Please check config.js."
        );

        console.error(
          "supabaseClient is undefined."
        );

        return;
      }


      /*
      Get form values
      */

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


      /*
      Basic validation
      */

      if (!customerName) {

        alert(
          "Please enter your name."
        );

        return;
      }


      if (!contactNumber) {

        alert(
          "Please enter your contact number."
        );

        return;
      }


      if (!packageName) {

        alert(
          "Please select a package."
        );

        return;
      }


      if (!deliveryAddress) {

        alert(
          "Please enter your delivery address."
        );

        return;
      }


      /*
      Disable button
      */

      submitBtn.disabled = true;

      const originalButtonText =
        "Send Booking Request";

      submitBtn.textContent =
        "Sending Booking...";


      /*
      Booking data
      */

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
        "Booking data:",
        bookingData
      );


      /*
      =====================================================
      SAVE TO SUPABASE
      =====================================================
      */

      try {

        const {
          data,
          error
        } = await supabaseClient
          .from("bookings")
          .insert([
            bookingData
          ])
          .select();


        /*
        Supabase returned an error
        */

        if (error) {

          console.error(
            "SUPABASE ERROR:",
            error
          );


          throw new Error(
            error.message ||
            "Supabase could not save the booking."
          );
        }


        console.log(
          "BOOKING SAVED:",
          data
        );


        /*
        ===================================================
        SUCCESS
        ===================================================
        */

        submitBtn.textContent =
          "Booking Sent ✓";


        const messengerMessage =
          `Hello JEPOY'S JBL PARTYBOX!%0A%0A` +

          `I would like to make a booking.%0A%0A` +

          `Name: ${encodeURIComponent(customerName)}%0A` +

          `Contact: ${encodeURIComponent(contactNumber)}%0A` +

          `Package: ${encodeURIComponent(packageName)}%0A` +

          `Date: ${encodeURIComponent(rentalDate)}%0A` +

          `Address: ${encodeURIComponent(deliveryAddress)}%0A` +

          `Distance: ${encodeURIComponent(calculatedDistanceKm + " km")}%0A` +

          `Delivery Fee: ${encodeURIComponent(
            calculatedDeliveryFee === 0
              ? "FREE"
              : formatPeso(calculatedDeliveryFee)
          )}%0A%0A` +

          `Google Maps Location:%0A` +

          `${encodeURIComponent(googleMapsLink)}`;


        /*
        Show confirmation
        */

        alert(
          "✅ Booking successfully sent!\n\n" +
          "Your booking status is Pending.\n\n" +
          "JEPOY'S JBL PARTYBOX will contact you shortly to confirm your booking."
        );


        /*
        Optional Messenger redirect
        */

        const messengerURL =
          `https://m.me/1218332498024792?text=${messengerMessage}`;


        const openMessenger =
          confirm(
            "Would you also like to send the booking details through Facebook Messenger?"
          );


        if (openMessenger) {

          window.open(
            messengerURL,
            "_blank"
          );
        }


        /*
        Reset form
        */

        bookingForm.reset();


        /*
        Restore today's minimum date
        */

        dateInput.min =
          getTodayLocalDate();


        /*
        Reset location
        */

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


      } catch (error) {

        /*
        ===================================================
        ERROR
        ===================================================
        */

        console.error(
          "BOOKING ERROR:",
          error
        );


        let errorMessage =
          error.message ||
          "Unknown error";


        /*
        Special message for network errors
        */

        if (
          errorMessage
            .toLowerCase()
            .includes("failed to fetch")
        ) {

          errorMessage =
            "The website could not connect to Supabase.\n\n" +
            "Please check your Supabase URL, API key, Internet connection, and Supabase settings.";
        }


        alert(
          "❌ Booking could not be saved.\n\n" +
          errorMessage
        );


        /*
        Restore button
        */

        submitBtn.disabled = false;

        submitBtn.textContent =
          originalButtonText;
      }

    }
  );


  /*
  ========================================================
  AUTOMATIC DATE CHECK
  ========================================================
  
  This runs whenever the page becomes visible again.
  It prevents yesterday's date from remaining selectable.
  
  ========================================================
  */

  function refreshMinimumDate() {

    const currentDate =
      getTodayLocalDate();

    dateInput.min =
      currentDate;


    if (
      dateInput.value &&
      dateInput.value < currentDate
    ) {

      dateInput.value = "";

      distanceDisplay.textContent =
        "Not calculated";

      feeDisplay.textContent =
        "Not calculated";
    }
  }


  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        refreshMinimumDate();

      }

    }
  );


  /*
  ========================================================
  INITIAL DATE SETUP
  ========================================================
  */

  refreshMinimumDate();


  console.log(
    "Booking system ready."
  );

});
