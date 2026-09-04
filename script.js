document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // BUSINESS LOCATION
  // =====================================================

  const BUSINESS_LAT = 15.989299;
  const BUSINESS_LNG = 120.2244473;


  // =====================================================
  // FORM ELEMENTS
  // =====================================================

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

  const dateDisplay =
    document.getElementById("dateDisplay");

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


  // =====================================================
  // CUSTOM CALENDAR ELEMENTS
  // =====================================================

  const calendarOverlay =
    document.getElementById(
      "calendarOverlay"
    );

  const calendarTitle =
    document.getElementById(
      "calendarTitle"
    );

  const calendarSelected =
    document.getElementById(
      "calendarSelected"
    );

  const calendarDays =
    document.getElementById(
      "calendarDays"
    );

  const calendarPrev =
    document.getElementById(
      "calendarPrev"
    );

  const calendarNext =
    document.getElementById(
      "calendarNext"
    );

  const calendarCancel =
    document.getElementById(
      "calendarCancel"
    );

  const calendarToday =
    document.getElementById(
      "calendarToday"
    );


  // =====================================================
  // DATE FUNCTIONS
  // =====================================================

  function getToday() {

    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

  }


  function dateToString(date) {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, "0");

    const day =
      String(
        date.getDate()
      ).padStart(2, "0");

    return `${year}-${month}-${day}`;

  }


  function stringToDate(value) {

    if (!value) {
      return null;
    }

    const parts =
      value.split("-");

    return new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

  }


  function formatDisplayDate(date) {

    return date.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );

  }


  // =====================================================
  // CALENDAR STATE
  // =====================================================

  const today =
    getToday();

  let calendarMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );


  // =====================================================
  // OPEN CALENDAR
  // =====================================================

  function openCalendar() {

    /*
    Always make sure the calendar
    starts at the current month if
    there is no selected date.
    */

    const selected =
      stringToDate(
        dateInput.value
      );


    if (selected) {

      calendarMonth =
        new Date(
          selected.getFullYear(),
          selected.getMonth(),
          1
        );

    } else {

      calendarMonth =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );

    }


    calendarOverlay.hidden =
      false;

    document.body.style.overflow =
      "hidden";

    renderCalendar();

  }


  // =====================================================
  // CLOSE CALENDAR
  // =====================================================

  function closeCalendar() {

    calendarOverlay.hidden =
      true;

    document.body.style.overflow =
      "";

  }


  // =====================================================
  // RENDER CALENDAR
  // =====================================================

  function renderCalendar() {

    const year =
      calendarMonth.getFullYear();

    const month =
      calendarMonth.getMonth();


    // -----------------------------------------------
    // TITLE
    // -----------------------------------------------

    calendarTitle.textContent =
      calendarMonth.toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric"
        }
      );


    // -----------------------------------------------
    // SELECTED DATE TEXT
    // -----------------------------------------------

    const selectedDate =
      stringToDate(
        dateInput.value
      );


    if (selectedDate) {

      calendarSelected.textContent =
        formatDisplayDate(
          selectedDate
        );

    } else {

      calendarSelected.textContent =
        "Select a date";

    }


    // -----------------------------------------------
    // PREVIOUS MONTH
    // -----------------------------------------------

    const currentMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );


    if (
      calendarMonth <=
      currentMonth
    ) {

      calendarPrev.disabled =
        true;

    } else {

      calendarPrev.disabled =
        false;

    }


    // -----------------------------------------------
    // CLEAR DAYS
    // -----------------------------------------------

    calendarDays.innerHTML =
      "";


    // -----------------------------------------------
    // FIRST DAY OF MONTH
    // -----------------------------------------------

    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();


    // -----------------------------------------------
    // NUMBER OF DAYS
    // -----------------------------------------------

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();


    // -----------------------------------------------
    // EMPTY DAYS
    // -----------------------------------------------

    for (
      let i = 0;
      i < firstDay;
      i++
    ) {

      const empty =
        document.createElement(
          "div"
        );

      empty.className =
        "calendar-empty";

      calendarDays.appendChild(
        empty
      );

    }


    // -----------------------------------------------
    // CREATE DAYS
    // -----------------------------------------------

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {

      const date =
        new Date(
          year,
          month,
          day
        );


      const button =
        document.createElement(
          "button"
        );


      button.type =
        "button";

      button.className =
        "calendar-day";

      button.textContent =
        day;


      // ---------------------------------------------
      // PAST DATE
      // ---------------------------------------------

      if (
        date < today
      ) {

        button.classList.add(
          "past"
        );

        button.disabled =
          true;

      }


      // ---------------------------------------------
      // TODAY
      // ---------------------------------------------

      if (
        date.getTime() ===
        today.getTime()
      ) {

        button.classList.add(
          "today"
        );

      }


      // ---------------------------------------------
      // SELECTED
      // ---------------------------------------------

      if (
        selectedDate &&
        date.getTime() ===
        selectedDate.getTime()
      ) {

        button.classList.add(
          "selected"
        );

      }


      // ---------------------------------------------
      // DATE CLICK
      // ---------------------------------------------

      if (
        date >= today
      ) {

        button.addEventListener(
          "click",
          () => {

            selectDate(date);

          }
        );

      }


      calendarDays.appendChild(
        button
      );

    }

  }


  // =====================================================
  // SELECT DATE
  // =====================================================

  function selectDate(date) {

    /*
    Absolute safety check.
    */

    if (
      date < today
    ) {

      return;

    }


    const value =
      dateToString(date);


    /*
    Hidden value sent to Supabase.
    */

    dateInput.value =
      value;


    /*
    Visible value.
    */

    dateDisplay.value =
      formatDisplayDate(date);


    calendarSelected.textContent =
      formatDisplayDate(date);


    closeCalendar();

  }


  // =====================================================
  // OPEN DATE PICKER
  // =====================================================

  dateDisplay.addEventListener(
    "click",
    openCalendar
  );


  // =====================================================
  // PREVIOUS MONTH
  // =====================================================

  calendarPrev.addEventListener(
    "click",
    () => {

      const currentMonth =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );


      const previousMonth =
        new Date(
          calendarMonth.getFullYear(),
          calendarMonth.getMonth() - 1,
          1
        );


      /*
      NEVER allow navigation
      before current month.
      */

      if (
        previousMonth >=
        currentMonth
      ) {

        calendarMonth =
          previousMonth;

        renderCalendar();

      }

    }
  );


  // =====================================================
  // NEXT MONTH
  // =====================================================

  calendarNext.addEventListener(
    "click",
    () => {

      calendarMonth =
        new Date(
          calendarMonth.getFullYear(),
          calendarMonth.getMonth() + 1,
          1
        );

      renderCalendar();

    }
  );


  // =====================================================
  // CANCEL
  // =====================================================

  calendarCancel.addEventListener(
    "click",
    closeCalendar
  );


  // =====================================================
  // TODAY BUTTON
  // =====================================================

  calendarToday.addEventListener(
    "click",
    () => {

      selectDate(
        getToday()
      );

    }
  );


  // =====================================================
  // CLICK OUTSIDE CALENDAR
  // =====================================================

  calendarOverlay.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        calendarOverlay
      ) {

        closeCalendar();

      }

    }
  );


  // =====================================================
  // ESCAPE KEY
  // =====================================================

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        !calendarOverlay.hidden
      ) {

        closeCalendar();

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

    const earthRadius =
      6371;

    const dLat =
      (lat2 - lat1) *
      Math.PI / 180;

    const dLon =
      (lon2 - lon1) *
      Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +

      Math.cos(
        lat1 * Math.PI / 180
      ) *

      Math.cos(
        lat2 * Math.PI / 180
      ) *

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

  function calculateDeliveryFee(
    distanceKm
  ) {

    if (
      distanceKm <= 5
    ) {

      return 0;

    }


    if (
      distanceKm <= 8
    ) {

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
      Number(amount)
        .toLocaleString(
          "en-PH"
        );

  }


  // =====================================================
  // LOCATION VARIABLES
  // =====================================================

  let customerLatitude =
    null;

  let customerLongitude =
    null;

  let calculatedDistanceKm =
    null;

  let calculatedDeliveryFee =
    null;

  let googleMapsLink =
    "";


  // =====================================================
  // UPDATE LOCATION
  // =====================================================

  function updateLocationDisplay(
    latitude,
    longitude
  ) {

    customerLatitude =
      latitude;

    customerLongitude =
      longitude;


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
          : formatPeso(
              calculatedDeliveryFee
            )
      }</b>
      `;

  }


  // =====================================================
  // GET GPS LOCATION
  // =====================================================

  function getCurrentLocation() {

    if (
      !navigator.geolocation
    ) {

      alert(
        "❌ Your browser does not support location services."
      );

      return;

    }


    locationBtn.disabled =
      true;

    locationBtn.textContent =
      "📍 Getting Location...";


    navigator.geolocation.getCurrentPosition(

      position => {

        updateLocationDisplay(
          position.coords.latitude,
          position.coords.longitude
        );


        locationBtn.disabled =
          false;

        locationBtn.textContent =
          "📍 Location Detected";

      },


      error => {

        console.error(
          "GPS ERROR:",
          error
        );


        locationBtn.disabled =
          false;

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

        }


        else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {

          message =
            "❌ Your location is currently unavailable.";

        }


        else if (
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
  // SUBMIT BOOKING
  // =====================================================

  bookingForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      // -----------------------------------------------
      // DATE VALIDATION
      // -----------------------------------------------

      const selectedDate =
        stringToDate(
          dateInput.value
        );


      if (
        !selectedDate
      ) {

        alert(
          "📅 Please select a rental date."
        );

        openCalendar();

        return;

      }


      if (
        selectedDate < today
      ) {

        alert(
          "❌ You cannot book a date that has already passed."
        );

        dateInput.value = "";

        dateDisplay.value = "";

        openCalendar();

        return;

      }


      // -----------------------------------------------
      // LOCATION
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
      // DELIVERY
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
      // SUPABASE
      // -----------------------------------------------

      if (
        typeof supabaseClient ===
        "undefined"
      ) {

        alert(
          "❌ Supabase is not configured. Please check config.js."
        );

        return;

      }


      // -----------------------------------------------
      // VALUES
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
      // DISABLE BUTTON
      // -----------------------------------------------

      submitBtn.disabled =
        true;

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
      // SAVE TO SUPABASE
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
          "JEPOY'S JBL PARTYBOX will contact you shortly."
        );


        // ---------------------------------------------
        // MESSENGER
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


        if (
          sendMessenger
        ) {

          window.open(
            messengerURL,
            "_blank"
          );

        }


        // ---------------------------------------------
        // RESET
        // ---------------------------------------------

        bookingForm.reset();

        dateInput.value =
          "";

        dateDisplay.value =
          "";

        customerLatitude =
          null;

        customerLongitude =
          null;

        calculatedDistanceKm =
          null;

        calculatedDeliveryFee =
          null;

        googleMapsLink =
          "";


        distanceDisplay.textContent =
          "Not calculated";

        feeDisplay.textContent =
          "Not calculated";

        resultDisplay.textContent =
          "Tap the button to calculate your distance.";


        submitBtn.disabled =
          false;

        submitBtn.textContent =
          "Send Booking Request";


      }


      catch (error) {

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
  // INITIALIZE
  // =====================================================

  console.log(
    "JEPOY'S JBL PARTYBOX custom calendar ready."
  );

});
