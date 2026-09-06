document.addEventListener("DOMContentLoaded", () => {

  /*
  =========================================================
  JEPOY'S JBL PARTYBOX
  COMPLETE BOOKING SCRIPT
  =========================================================
  */


  // =====================================================
  // BUSINESS LOCATION
  // =====================================================

  const BUSINESS_LAT = 15.989299;
  const BUSINESS_LNG = 120.2244473;


  // =====================================================
  // FORM ELEMENTS
  // =====================================================

  const bookingForm = document.getElementById("bookingForm");

  const nameInput = document.getElementById("name");

  const phoneInput = document.getElementById("phone");

  const packageInput = document.getElementById("package");

  const dateInput = document.getElementById("date");

  const dateDisplay = document.getElementById("dateDisplay");

  const addressInput = document.getElementById("address");

  const locationBtn = document.getElementById("locationBtn");

  const calculateBtn = document.getElementById("calc");

  const submitBtn = document.getElementById("submitBooking");

  const distanceDisplay = document.getElementById("distance");

  const feeDisplay = document.getElementById("fee");

  const resultDisplay = document.getElementById("result");


  // =====================================================
  // CHECK REQUIRED ELEMENTS
  // =====================================================

  if (!bookingForm) {
    console.error("bookingForm was not found.");
    return;
  }

  if (!dateInput) {
    console.error("date input was not found.");
    return;
  }

  if (!window.supabase) {
    console.error("Supabase library was not loaded.");
  }

  if (typeof supabaseClient === "undefined") {
    console.error("supabaseClient was not created. Check config.js.");
  }


  // =====================================================
  // CUSTOM CALENDAR ELEMENTS
  // =====================================================

  const calendarOverlay =
    document.getElementById("calendarOverlay");

  const calendarTitle =
    document.getElementById("calendarTitle");

  const calendarSelected =
    document.getElementById("calendarSelected");

  const calendarDays =
    document.getElementById("calendarDays");

  const calendarPrev =
    document.getElementById("calendarPrev");

  const calendarNext =
    document.getElementById("calendarNext");

  const calendarCancel =
    document.getElementById("calendarCancel");

  const calendarToday =
    document.getElementById("calendarToday");


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
      String(date.getMonth() + 1).padStart(2, "0");

    const day =
      String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

  }


  function stringToDate(value) {

    if (!value) {
      return null;
    }

    const parts = value.split("-");

    if (parts.length !== 3) {
      return null;
    }

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

  let today = getToday();

  let calendarMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );


  // =====================================================
  // UPDATE TODAY
  // =====================================================

  function refreshToday() {

    today = getToday();

  }


  // =====================================================
  // SET DATE DISPLAY
  // =====================================================

  function setDateDisplay(date) {

    const text = formatDisplayDate(date);

    /*
    Supports either:
    - input
    - button
    - div
    - span
    */

    if (
      "value" in dateDisplay
    ) {

      dateDisplay.value = text;

    } else {

      dateDisplay.textContent = text;

    }

  }


  // =====================================================
  // CLEAR DATE DISPLAY
  // =====================================================

  function clearDateDisplay() {

    if (
      dateDisplay &&
      "value" in dateDisplay
    ) {

      dateDisplay.value = "";

    }

    else if (dateDisplay) {

      dateDisplay.textContent = "Select a date";

    }

  }


  // =====================================================
  // OPEN CALENDAR
  // =====================================================

  function openCalendar() {

    if (!calendarOverlay) {
      console.error("calendarOverlay was not found.");
      return;
    }

    refreshToday();

    const selected =
      stringToDate(dateInput.value);


    if (selected) {

      /*
      Never open the calendar
      before the current month.
      */

      const currentMonth =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );

      const selectedMonth =
        new Date(
          selected.getFullYear(),
          selected.getMonth(),
          1
        );

      if (selectedMonth < currentMonth) {

        calendarMonth =
          currentMonth;

      } else {

        calendarMonth =
          selectedMonth;

      }

    } else {

      calendarMonth =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        );

    }


    calendarOverlay.hidden = false;

    document.body.style.overflow = "hidden";

    renderCalendar();

  }


  // =====================================================
  // CLOSE CALENDAR
  // =====================================================

  function closeCalendar() {

    if (!calendarOverlay) {
      return;
    }

    calendarOverlay.hidden = true;

    document.body.style.overflow = "";

  }


  // =====================================================
  // RENDER CALENDAR
  // =====================================================

  function renderCalendar() {

    if (
      !calendarTitle ||
      !calendarDays
    ) {
      return;
    }

    refreshToday();

    const year =
      calendarMonth.getFullYear();

    const month =
      calendarMonth.getMonth();


    // ===================================================
    // CALENDAR TITLE
    // ===================================================

    calendarTitle.textContent =
      calendarMonth.toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric"
        }
      );


    // ===================================================
    // SELECTED DATE
    // ===================================================

    const selectedDate =
      stringToDate(dateInput.value);


    if (selectedDate) {

      if (calendarSelected) {

        calendarSelected.textContent =
          formatDisplayDate(selectedDate);

      }

    } else {

      if (calendarSelected) {

        calendarSelected.textContent =
          "Select a date";

      }

    }


    // ===================================================
    // PREVIOUS MONTH
    // ===================================================

    const currentMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );


    if (calendarPrev) {

      calendarPrev.disabled =
        calendarMonth <= currentMonth;

    }


    // ===================================================
    // CLEAR DAYS
    // ===================================================

    calendarDays.innerHTML = "";


    // ===================================================
    // FIRST DAY
    // ===================================================

    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();


    // ===================================================
    // DAYS IN MONTH
    // ===================================================

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();


    // ===================================================
    // EMPTY DAYS
    // ===================================================

    for (
      let i = 0;
      i < firstDay;
      i++
    ) {

      const empty =
        document.createElement("div");

      empty.className =
        "calendar-empty";

      calendarDays.appendChild(empty);

    }


    // ===================================================
    // CREATE DAYS
    // ===================================================

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
        document.createElement("button");


      button.type = "button";

      button.className = "calendar-day";

      button.textContent = day;


      // =================================================
      // PAST DATE
      // =================================================

      if (date < today) {

        button.classList.add("past");

        button.disabled = true;

      }


      // =================================================
      // TODAY
      // =================================================

      if (
        date.getTime() ===
        today.getTime()
      ) {

        button.classList.add("today");

      }


      // =================================================
      // SELECTED
      // =================================================

      if (
        selectedDate &&
        date.getTime() ===
        selectedDate.getTime()
      ) {

        button.classList.add("selected");

      }


      // =================================================
      // CLICK
      // =================================================

      if (date >= today) {

        button.addEventListener(
          "click",
          () => {

            selectDate(date);

          }
        );

      }


      calendarDays.appendChild(button);

    }

  }


  // =====================================================
  // SELECT DATE
  // =====================================================

  function selectDate(date) {

    refreshToday();


    // ---------------------------------------------------
    // NEVER ALLOW PAST DATE
    // ---------------------------------------------------

    if (date < today) {

      alert(
        "❌ You cannot select a date that has already passed."
      );

      return;

    }


    // ---------------------------------------------------
    // SAVE DATE
    // ---------------------------------------------------

    const value =
      dateToString(date);


    dateInput.value =
      value;


    // ---------------------------------------------------
    // DISPLAY DATE
    // ---------------------------------------------------

    if (dateDisplay) {

      setDateDisplay(date);

    }


    if (calendarSelected) {

      calendarSelected.textContent =
        formatDisplayDate(date);

    }


    // ---------------------------------------------------
    // CLOSE
    // ---------------------------------------------------

    closeCalendar();

  }


  // =====================================================
  // DATE PICKER CLICK
  // =====================================================

  if (dateDisplay) {

    dateDisplay.addEventListener(
      "click",
      openCalendar
    );

  }


  // =====================================================
  // PREVIOUS MONTH
  // =====================================================

  if (calendarPrev) {

    calendarPrev.addEventListener(
      "click",
      () => {

        refreshToday();

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

  }


  // =====================================================
  // NEXT MONTH
  // =====================================================

  if (calendarNext) {

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

  }


  // =====================================================
  // CANCEL
  // =====================================================

  if (calendarCancel) {

    calendarCancel.addEventListener(
      "click",
      closeCalendar
    );

  }


  // =====================================================
  // TODAY
  // =====================================================

  if (calendarToday) {

    calendarToday.addEventListener(
      "click",
      () => {

        selectDate(
          getToday()
        );

      }
    );

  }


  // =====================================================
  // CLICK OUTSIDE
  // =====================================================

  if (calendarOverlay) {

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

  }


  // =====================================================
  // ESCAPE
  // =====================================================

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        calendarOverlay &&
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

    const earthRadius = 6371;


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

    /*
    0 - 5 km
    FREE
    */

    if (distanceKm <= 5) {

      return 0;

    }


    /*
    5.01 - 8 km
    ₱100
    */

    if (distanceKm <= 8) {

      return 100;

    }


    /*
    Beyond 8 km
    + ₱50 every additional 3 km
    */

    const additionalKm =
      distanceKm - 8;


    const additionalBlocks =
      Math.ceil(
        additionalKm / 3
      );


    return (
      100 +
      additionalBlocks * 50
    );

  }


  // =====================================================
  // PESO FORMAT
  // =====================================================

  function formatPeso(amount) {

    return (
      "₱" +
      Number(amount).toLocaleString(
        "en-PH"
      )
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

    customerLatitude =
      Number(latitude);

    customerLongitude =
      Number(longitude);


    calculatedDistanceKm =
      calculateDistanceKm(
        BUSINESS_LAT,
        BUSINESS_LNG,
        customerLatitude,
        customerLongitude
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
      `https://www.google.com/maps?q=${customerLatitude},${customerLongitude}`;


    if (distanceDisplay) {

      distanceDisplay.textContent =
        `${calculatedDistanceKm.toFixed(2)} km`;

    }


    if (feeDisplay) {

      feeDisplay.textContent =
        calculatedDeliveryFee === 0
          ? "FREE"
          : formatPeso(
              calculatedDeliveryFee
            );

    }


    if (resultDisplay) {

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
        }</b><br>
        <a
          href="${googleMapsLink}"
          target="_blank"
          rel="noopener"
        >
          📍 View location on Google Maps
        </a>
        `;

    }

  }


  // =====================================================
  // GET CURRENT LOCATION
  // =====================================================

  function getCurrentLocation() {

    if (!navigator.geolocation) {

      alert(
        "❌ Your browser does not support location services."
      );

      return;

    }


    if (locationBtn) {

      locationBtn.disabled = true;

      locationBtn.textContent =
        "📍 Getting Location...";

    }


    navigator.geolocation.getCurrentPosition(

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      position => {

        console.log(
          "GPS POSITION:",
          position.coords
        );


        updateLocationDisplay(
          position.coords.latitude,
          position.coords.longitude
        );


        if (locationBtn) {

          locationBtn.disabled = false;

          locationBtn.textContent =
            "📍 Location Detected";

        }

      },


      // -------------------------------------------------
      // ERROR
      // -------------------------------------------------

      error => {

        console.error(
          "GPS ERROR:",
          error
        );


        if (locationBtn) {

          locationBtn.disabled = false;

          locationBtn.textContent =
            "📍 Use My Current Location";

        }


        let message =
          "Unable to get your location.";


        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {

          message =
            "❌ Location permission was denied.\n\n" +
            "Please allow location access for this website in your browser settings.";

        }

        else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {

          message =
            "❌ Your location is currently unavailable.\n\n" +
            "Please make sure Location/GPS is turned on.";

        }

        else if (
          error.code ===
          error.TIMEOUT
        ) {

          message =
            "❌ Location request timed out.\n\n" +
            "Please try again.";

        }


        alert(message);

      },


      // -------------------------------------------------
      // OPTIONS
      // -------------------------------------------------

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

  if (locationBtn) {

    locationBtn.addEventListener(
      "click",
      getCurrentLocation
    );

  }


  // =====================================================
  // CALCULATE DELIVERY
  // =====================================================

  if (calculateBtn) {

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

  }


  // =====================================================
  // SUBMIT BOOKING
  // =====================================================

  bookingForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      // =================================================
      // REFRESH TODAY
      // =================================================

      refreshToday();


      // =================================================
      // CHECK DATE
      // =================================================

      const selectedDate =
        stringToDate(
          dateInput.value
        );


      if (!selectedDate) {

        alert(
          "📅 Please select a rental date."
        );

        openCalendar();

        return;

      }


      if (selectedDate < today) {

        alert(
          "❌ You cannot book a date that has already passed."
        );


        dateInput.value = "";

        clearDateDisplay();

        openCalendar();

        return;

      }


      // =================================================
      // CHECK LOCATION
      // =================================================

      if (
        customerLatitude === null ||
        customerLongitude === null
      ) {

        alert(
          "📍 Please use your current location before sending the booking."
        );

        return;

      }


      // =================================================
      // CHECK DELIVERY
      // =================================================

      if (
        calculatedDistanceKm === null ||
        calculatedDeliveryFee === null
      ) {

        alert(
          "📍 Please calculate your delivery first."
        );

        return;

      }


      // =================================================
      // CHECK SUPABASE
      // =================================================

      if (
        typeof supabaseClient ===
        "undefined"
      ) {

        alert(
          "❌ Supabase is not configured.\n\n" +
          "Please check config.js."
        );

        return;

      }


      // =================================================
      // GET FORM VALUES
      // =================================================

      const customerName =
        nameInput
          ? nameInput.value.trim()
          : "";


      const contactNumber =
        phoneInput
          ? phoneInput.value.trim()
          : "";


      const packageName =
        packageInput
          ? packageInput.value.trim()
          : "";


      const rentalDate =
        dateInput.value;


      const deliveryAddress =
        addressInput
          ? addressInput.value.trim()
          : "";


      // =================================================
      // BASIC VALIDATION
      // =================================================

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


      // =================================================
      // DISABLE SUBMIT BUTTON
      // =================================================

      if (submitBtn) {

        submitBtn.disabled = true;

        submitBtn.textContent =
          "Sending Booking...";

      }


      // =================================================
      // BOOKING DATA
      // =================================================

      /*
      IMPORTANT:

      Your Supabase table currently uses:

      costumer_name

      NOT:

      customer_name

      Therefore this must stay
      costumer_name until you rename
      the database column.
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
        "BOOKING DATA:",
        bookingData
      );


      // =================================================
      // SAVE TO SUPABASE
      // =================================================

      try {

        /*
        IMPORTANT FIX:

        DO NOT use .select() here.

        Your website only needs INSERT permission.
        Using .select() asks Supabase to return
        the inserted row, which can require SELECT
        permission/RLS.

        Therefore we use ONLY insert().
        */

        const {
          error
        } =
          await supabaseClient
            .from("bookings")
            .insert(
              bookingData
            );


        // =================================================
        // SUPABASE ERROR
        // =================================================

        if (error) {

          console.error(
            "SUPABASE ERROR:",
            error
          );


          throw new Error(
            error.message
          );

        }


        // =================================================
        // SUCCESS
        // =================================================

        console.log(
          "BOOKING SAVED SUCCESSFULLY"
        );


        alert(
          "✅ BOOKING SUCCESSFUL!\n\n" +
          "Your booking request has been received.\n\n" +
          "Status: Pending\n\n" +
          "JEPOY'S JBL PARTYBOX will contact you shortly."
        );


        // =================================================
        // MESSENGER MESSAGE
        // =================================================

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


        // =================================================
        // MESSENGER CONFIRMATION
        // =================================================

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


        // =================================================
        // RESET FORM
        // =================================================

        bookingForm.reset();


        dateInput.value =
          "";


        clearDateDisplay();


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


        if (distanceDisplay) {

          distanceDisplay.textContent =
            "Not calculated";

        }


        if (feeDisplay) {

          feeDisplay.textContent =
            "Not calculated";

        }


        if (resultDisplay) {

          resultDisplay.textContent =
            "Tap the button to calculate your distance.";

        }


        if (locationBtn) {

          locationBtn.disabled = false;

          locationBtn.textContent =
            "📍 Use My Current Location";

        }


        if (submitBtn) {

          submitBtn.disabled = false;

          submitBtn.textContent =
            "Send Booking Request";

        }

      }


      // =================================================
      // ERROR
      // =================================================

      catch (error) {

        console.error(
          "BOOKING ERROR:",
          error
        );


        let message =
          error.message ||
          "Unknown error";


        const lowerMessage =
          message.toLowerCase();


        // -----------------------------------------------
        // RLS ERROR
        // -----------------------------------------------

        if (
          lowerMessage.includes(
            "row-level security"
          )
        ) {

          message =
            "Supabase blocked the booking because of the Row Level Security policy.\n\n" +
            "Make sure the public INSERT policy for the bookings table is enabled.";

        }


        // -----------------------------------------------
        // FAILED FETCH
        // -----------------------------------------------

        else if (
          lowerMessage.includes(
            "failed to fetch"
          )
        ) {

          message =
            "The website could not connect to Supabase.\n\n" +
            "Check your Supabase URL, publishable/anon key, internet connection, and Data API settings.";

        }


        // -----------------------------------------------
        // COLUMN ERROR
        // -----------------------------------------------

        else if (
          lowerMessage.includes(
            "column"
          ) &&
          lowerMessage.includes(
            "does not exist"
          )
        ) {

          message =
            "One of the column names in script.js does not match your Supabase bookings table.\n\n" +
            "Check the column names in Supabase.";

        }


        // -----------------------------------------------
        // SHOW ERROR
        // -----------------------------------------------

        alert(
          "❌ BOOKING COULD NOT BE SAVED.\n\n" +
          message
        );


        // -----------------------------------------------
        // ENABLE BUTTON
        // -----------------------------------------------

        if (submitBtn) {

          submitBtn.disabled = false;

          submitBtn.textContent =
            "Send Booking Request";

        }

      }

    }
  );


  // =====================================================
  // INITIALIZE CALENDAR
  // =====================================================

  refreshToday();


  if (dateInput.value) {

    const initialDate =
      stringToDate(
        dateInput.value
      );


    if (
      initialDate &&
      initialDate >= today
    ) {

      setDateDisplay(
        initialDate
      );

    }

  }


  // =====================================================
  // FINAL MESSAGE
  // =====================================================

  console.log(
    "✅ JEPOY'S JBL PARTYBOX booking system loaded."
  );

  console.log(
    "✅ Custom calendar enabled."
  );

  console.log(
    "✅ Past dates blocked."
  );

  console.log(
    "✅ GPS location enabled."
  );

  console.log(
    "✅ Delivery calculation enabled."
  );

  console.log(
    "✅ Supabase booking INSERT enabled."
  );

});
