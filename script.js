document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // JEPOY'S JBL PARTYBOX
  // COMPLETE BOOKING SYSTEM
  // =========================================================


  // =========================================================
  // BUSINESS LOCATION
  // =========================================================

  const BUSINESS_LAT = 15.989299;
  const BUSINESS_LNG = 120.2244473;


  // =========================================================
  // GET ELEMENTS
  // =========================================================

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


  // =========================================================
  // CALENDAR ELEMENTS
  // =========================================================

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


  // =========================================================
  // CHECK REQUIRED ELEMENTS
  // =========================================================

  if (!bookingForm) {
    console.error("bookingForm was not found.");
    return;
  }

  if (!window.supabase) {
    console.error("Supabase library was not loaded.");
  }

  if (typeof supabaseClient === "undefined") {
    console.error("supabaseClient was not found.");
  }


  // =========================================================
  // DATE FUNCTIONS
  // =========================================================

  function getToday() {

    const now = new Date();

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
  }


  function refreshToday() {

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
      String(date.getMonth() + 1)
        .padStart(2, "0");

    const day =
      String(date.getDate())
        .padStart(2, "0");

    return `${year}-${month}-${day}`;
  }


  function stringToDate(value) {

    if (!value) {
      return null;
    }

    const parts =
      value.split("-");

    if (parts.length !== 3) {
      return null;
    }

    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]) - 1;

    const day =
      Number(parts[2]);

    const date =
      new Date(
        year,
        month,
        day
      );

    if (isNaN(date.getTime())) {
      return null;
    }

    return date;
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


  // =========================================================
  // TODAY
  // =========================================================

  let today = getToday();


  // =========================================================
  // CALENDAR MONTH
  // =========================================================

  let calendarMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );


  // =========================================================
  // OPEN CALENDAR
  // =========================================================

  function openCalendar() {

    today = refreshToday();

    const selected =
      stringToDate(
        dateInput ? dateInput.value : ""
      );

    if (selected && selected >= today) {

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


    if (calendarOverlay) {

      calendarOverlay.hidden = false;

    }


    document.body.style.overflow = "hidden";

    renderCalendar();
  }


  // =========================================================
  // CLOSE CALENDAR
  // =========================================================

  function closeCalendar() {

    if (calendarOverlay) {

      calendarOverlay.hidden = true;

    }

    document.body.style.overflow = "";
  }


  // =========================================================
  // RENDER CALENDAR
  // =========================================================

  function renderCalendar() {

    if (
      !calendarDays ||
      !calendarTitle
    ) {
      return;
    }


    today = refreshToday();


    const year =
      calendarMonth.getFullYear();

    const month =
      calendarMonth.getMonth();


    // -------------------------------------------------------
    // TITLE
    // -------------------------------------------------------

    calendarTitle.textContent =
      calendarMonth.toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric"
        }
      );


    // -------------------------------------------------------
    // SELECTED DATE
    // -------------------------------------------------------

    const selectedDate =
      stringToDate(
        dateInput ? dateInput.value : ""
      );


    if (
      calendarSelected
    ) {

      if (selectedDate) {

        calendarSelected.textContent =
          formatDisplayDate(
            selectedDate
          );

      } else {

        calendarSelected.textContent =
          "Select a date";
      }
    }


    // -------------------------------------------------------
    // PREVIOUS MONTH
    // -------------------------------------------------------

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


    // -------------------------------------------------------
    // CLEAR CALENDAR
    // -------------------------------------------------------

    calendarDays.innerHTML = "";


    // -------------------------------------------------------
    // FIRST DAY
    // -------------------------------------------------------

    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();


    // -------------------------------------------------------
    // NUMBER OF DAYS
    // -------------------------------------------------------

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();


    // -------------------------------------------------------
    // EMPTY CELLS
    // -------------------------------------------------------

    for (
      let i = 0;
      i < firstDay;
      i++
    ) {

      const empty =
        document.createElement("div");

      empty.className =
        "calendar-empty";

      calendarDays.appendChild(
        empty
      );
    }


    // -------------------------------------------------------
    // DAYS
    // -------------------------------------------------------

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

      button.className =
        "calendar-day";

      button.textContent =
        day;


      // -----------------------------------------------------
      // PAST DATE
      // -----------------------------------------------------

      if (date < today) {

        button.disabled = true;

        button.classList.add(
          "past"
        );
      }


      // -----------------------------------------------------
      // TODAY
      // -----------------------------------------------------

      if (
        date.getTime() ===
        today.getTime()
      ) {

        button.classList.add(
          "today"
        );
      }


      // -----------------------------------------------------
      // SELECTED
      // -----------------------------------------------------

      if (
        selectedDate &&
        date.getTime() ===
        selectedDate.getTime()
      ) {

        button.classList.add(
          "selected"
        );
      }


      // -----------------------------------------------------
      // CLICK
      // -----------------------------------------------------

      if (date >= today) {

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


  // =========================================================
  // SELECT DATE
  // =========================================================

  function selectDate(date) {

    today = refreshToday();


    if (date < today) {

      alert(
        "You cannot select a date that has already passed."
      );

      return;
    }


    const value =
      dateToString(date);


    // -------------------------------------------------------
    // HIDDEN DATE VALUE
    // -------------------------------------------------------

    if (dateInput) {

      dateInput.value = value;

    }


    // -------------------------------------------------------
    // DISPLAY DATE
    // -------------------------------------------------------

    if (dateDisplay) {

      /*
       * Some versions of the HTML use an input.
       * Other versions may use a button/div.
       * This handles both.
       */

      if (
        "value" in dateDisplay
      ) {

        dateDisplay.value =
          formatDisplayDate(date);

      } else {

        dateDisplay.textContent =
          formatDisplayDate(date);
      }
    }


    if (calendarSelected) {

      calendarSelected.textContent =
        formatDisplayDate(date);

    }


    closeCalendar();
  }


  // =========================================================
  // DATE PICKER CLICK
  // =========================================================

  if (dateDisplay) {

    dateDisplay.addEventListener(
      "click",
      openCalendar
    );
  }


  // =========================================================
  // PREVIOUS MONTH
  // =========================================================

  if (calendarPrev) {

    calendarPrev.addEventListener(
      "click",
      () => {

        today = refreshToday();


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


  // =========================================================
  // NEXT MONTH
  // =========================================================

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


  // =========================================================
  // CANCEL
  // =========================================================

  if (calendarCancel) {

    calendarCancel.addEventListener(
      "click",
      closeCalendar
    );
  }


  // =========================================================
  // TODAY BUTTON
  // =========================================================

  if (calendarToday) {

    calendarToday.addEventListener(
      "click",
      () => {

        selectDate(
          refreshToday()
        );

      }
    );
  }


  // =========================================================
  // CLICK OUTSIDE CALENDAR
  // =========================================================

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


  // =========================================================
  // ESCAPE KEY
  // =========================================================

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


  // =========================================================
  // HAVERSINE DISTANCE
  // =========================================================

  function calculateDistanceKm(
    lat1,
    lon1,
    lat2,
    lon2
  ) {

    const earthRadius = 6371;


    const dLat =
      (lat2 - lat1) *
      Math.PI /
      180;


    const dLon =
      (lon2 - lon1) *
      Math.PI /
      180;


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


  // =========================================================
  // DELIVERY FEE
  // =========================================================

  function calculateDeliveryFee(
    distanceKm
  ) {

    // 0 - 5 km = FREE

    if (
      distanceKm <= 5
    ) {

      return 0;
    }


    // 5.01 - 8 km = ₱100

    if (
      distanceKm <= 8
    ) {

      return 100;
    }


    // More than 8 km

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


  // =========================================================
  // PESO FORMAT
  // =========================================================

  function formatPeso(
    amount
  ) {

    return (
      "₱" +
      Number(amount).toLocaleString(
        "en-PH"
      )
    );
  }


  // =========================================================
  // LOCATION VARIABLES
  // =========================================================

  let customerLatitude = null;

  let customerLongitude = null;

  let calculatedDistanceKm = null;

  let calculatedDeliveryFee = null;

  let googleMapsLink = "";


  // =========================================================
  // UPDATE LOCATION
  // =========================================================

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


    // -------------------------------------------------------
    // DISTANCE
    // -------------------------------------------------------

    if (distanceDisplay) {

      distanceDisplay.textContent =
        `${calculatedDistanceKm.toFixed(2)} km`;

    }


    // -------------------------------------------------------
    // DELIVERY FEE
    // -------------------------------------------------------

    if (feeDisplay) {

      feeDisplay.textContent =
        calculatedDeliveryFee === 0
          ? "FREE"
          : formatPeso(
              calculatedDeliveryFee
            );

    }


    // -------------------------------------------------------
    // RESULT
    // -------------------------------------------------------

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
        }</b>
        `;
    }
  }


  // =========================================================
  // GET CURRENT LOCATION
  // =========================================================

  function getCurrentLocation() {

    if (
      !navigator.geolocation
    ) {

      alert(
        "Your browser does not support location services."
      );

      return;
    }


    if (locationBtn) {

      locationBtn.disabled = true;

      locationBtn.textContent =
        "📍 Getting Location...";
    }


    navigator.geolocation.getCurrentPosition(

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      position => {

        updateLocationDisplay(
          position.coords.latitude,
          position.coords.longitude
        );


        if (locationBtn) {

          locationBtn.disabled =
            false;

          locationBtn.textContent =
            "📍 Location Detected";
        }
      },


      // -----------------------------------------------------
      // ERROR
      // -----------------------------------------------------

      error => {

        console.error(
          "GPS ERROR:",
          error
        );


        if (locationBtn) {

          locationBtn.disabled =
            false;

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
            "Location permission was denied. Please allow location access for this website and try again.";

        }

        else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {

          message =
            "Your location is currently unavailable.";

        }

        else if (
          error.code ===
          error.TIMEOUT
        ) {

          message =
            "Location request timed out. Please try again.";

        }


        alert(
          "❌ " + message
        );
      },


      // -----------------------------------------------------
      // OPTIONS
      // -----------------------------------------------------

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }


  // =========================================================
  // LOCATION BUTTON
  // =========================================================

  if (locationBtn) {

    locationBtn.addEventListener(
      "click",
      getCurrentLocation
    );
  }


  // =========================================================
  // CALCULATE DELIVERY BUTTON
  // =========================================================

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


  // =========================================================
  // SUBMIT BOOKING
  // =========================================================

  bookingForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      // -----------------------------------------------------
      // REFRESH TODAY
      // -----------------------------------------------------

      today = refreshToday();


      // -----------------------------------------------------
      // DATE
      // -----------------------------------------------------

      const rentalDate =
        dateInput
          ? dateInput.value
          : "";


      const selectedDate =
        stringToDate(
          rentalDate
        );


      if (!selectedDate) {

        alert(
          "📅 Please select a rental date."
        );

        openCalendar();

        return;
      }


      // -----------------------------------------------------
      // BLOCK PAST DATES
      // -----------------------------------------------------

      if (
        selectedDate < today
      ) {

        alert(
          "❌ You cannot book a date that has already passed."
        );


        if (dateInput) {

          dateInput.value = "";
        }


        if (dateDisplay) {

          if (
            "value" in dateDisplay
          ) {

            dateDisplay.value = "";

          } else {

            dateDisplay.textContent =
              "Select Date";
          }
        }


        openCalendar();

        return;
      }


      // -----------------------------------------------------
      // CUSTOMER NAME
      // -----------------------------------------------------

      const customerName =
        nameInput
          ? nameInput.value.trim()
          : "";


      if (!customerName) {

        alert(
          "Please enter your name."
        );

        if (nameInput) {

          nameInput.focus();
        }

        return;
      }


      // -----------------------------------------------------
      // CONTACT
      // -----------------------------------------------------

      const contactNumber =
        phoneInput
          ? phoneInput.value.trim()
          : "";


      if (!contactNumber) {

        alert(
          "Please enter your contact number."
        );

        if (phoneInput) {

          phoneInput.focus();
        }

        return;
      }


      // -----------------------------------------------------
      // PACKAGE
      // -----------------------------------------------------

      const packageName =
        packageInput
          ? packageInput.value.trim()
          : "";


      if (!packageName) {

        alert(
          "Please select a package."
        );

        if (packageInput) {

          packageInput.focus();
        }

        return;
      }


      // -----------------------------------------------------
      // ADDRESS
      // -----------------------------------------------------

      const deliveryAddress =
        addressInput
          ? addressInput.value.trim()
          : "";


      if (!deliveryAddress) {

        alert(
          "Please enter your delivery address."
        );

        if (addressInput) {

          addressInput.focus();
        }

        return;
      }


      // -----------------------------------------------------
      // GPS
      // -----------------------------------------------------

      if (
        customerLatitude === null ||
        customerLongitude === null
      ) {

        alert(
          "📍 Please use your current location before sending the booking."
        );

        return;
      }


      // -----------------------------------------------------
      // DELIVERY CALCULATION
      // -----------------------------------------------------

      if (
        calculatedDistanceKm === null ||
        calculatedDeliveryFee === null
      ) {

        alert(
          "Please calculate your delivery first."
        );

        return;
      }


      // =====================================================
      // SUPABASE CHECK
      // =====================================================

      if (
        typeof supabaseClient ===
        "undefined"
      ) {

        alert(
          "❌ Supabase is not configured. Please check config.js."
        );

        return;
      }


      // =====================================================
      // BOOKING DATA
      // =====================================================
      //
      // IMPORTANT:
      // The database column is CUSTOMER_NAME.
      //
      // NOT:
      // costumer_name
      //
      // =====================================================

      const bookingData = {

        customer_name:
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


      // =====================================================
      // DISABLE SUBMIT BUTTON
      // =====================================================

      if (submitBtn) {

        submitBtn.disabled = true;

        submitBtn.textContent =
          "Sending Booking...";
      }


      // =====================================================
      // SAVE TO SUPABASE
      // =====================================================

      try {

        /*
         * IMPORTANT:
         *
         * We intentionally DO NOT use .select()
         * after insert.
         *
         * This means the website only needs INSERT
         * permission through your RLS policy.
         */

        const {
          error
        } =
          await supabaseClient
            .from("bookings")
            .insert(
              bookingData
            );


        // ---------------------------------------------------
        // SUPABASE ERROR
        // ---------------------------------------------------

        if (error) {

          console.error(
            "SUPABASE ERROR:",
            error
          );

          throw new Error(
            error.message
          );
        }


        // ===================================================
        // SUCCESS
        // ===================================================

        console.log(
          "BOOKING SAVED SUCCESSFULLY"
        );


        alert(
          "✅ BOOKING SUCCESSFUL!\n\n" +
          "Your booking request has been received.\n\n" +
          "Status: Pending\n\n" +
          "JEPOY'S JBL PARTYBOX will contact you shortly."
        );


        // ===================================================
        // MESSENGER MESSAGE
        // ===================================================

        const messengerMessage =
          `Hello JEPOY'S JBL PARTYBOX!\n\n` +

          `I would like to make a booking.\n\n` +

          `Name: ${customerName}\n` +

          `Contact: ${contactNumber}\n` +

          `Package: ${packageName}\n` +

          `Date: ${formatDisplayDate(selectedDate)}\n` +

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


        // ===================================================
        // RESET FORM
        // ===================================================

        bookingForm.reset();


        if (dateInput) {

          dateInput.value = "";
        }


        if (dateDisplay) {

          if (
            "value" in dateDisplay
          ) {

            dateDisplay.value = "";

          } else {

            dateDisplay.textContent =
              "Select Date";
          }
        }


        // ---------------------------------------------------
        // RESET LOCATION
        // ---------------------------------------------------

        customerLatitude = null;

        customerLongitude = null;

        calculatedDistanceKm = null;

        calculatedDeliveryFee = null;

        googleMapsLink = "";


        // ---------------------------------------------------
        // RESET DISPLAY
        // ---------------------------------------------------

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

          locationBtn.disabled =
            false;

          locationBtn.textContent =
            "📍 Use My Current Location";
        }


        if (submitBtn) {

          submitBtn.disabled =
            false;

          submitBtn.textContent =
            "Send Booking Request";
        }


        // ---------------------------------------------------
        // RESET CALENDAR
        // ---------------------------------------------------

        today = refreshToday();

        calendarMonth =
          new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );


      }

      // =====================================================
      // ERROR
      // =====================================================

      catch (error) {

        console.error(
          "BOOKING ERROR:",
          error
        );


        let message =
          error &&
          error.message
            ? error.message
            : "Unknown error";


        // ---------------------------------------------------
        // FRIENDLY RLS MESSAGE
        // ---------------------------------------------------

        if (
          message
            .toLowerCase()
            .includes(
              "row-level security"
            )
        ) {

          message =
            "Supabase blocked the booking because of your RLS policy. Make sure the public INSERT policy is enabled for the anon role.";
        }


        // ---------------------------------------------------
        // FRIENDLY COLUMN MESSAGE
        // ---------------------------------------------------

        if (
          message
            .toLowerCase()
            .includes(
              "costumer_name"
            )
        ) {

          message =
            "The website is still using the old costumer_name column. Make sure this new script.js has been uploaded to GitHub and the page has been refreshed.";
        }


        // ---------------------------------------------------
        // FETCH ERROR
        // ---------------------------------------------------

        if (
          message
            .toLowerCase()
            .includes(
              "failed to fetch"
            )
        ) {

          message =
            "The website could not connect to Supabase. Check your Supabase URL, publishable/anon key, internet connection, and Supabase settings.";
        }


        alert(
          "❌ Booking could not be saved.\n\n" +
          message
        );


        // ---------------------------------------------------
        // ENABLE BUTTON AGAIN
        // ---------------------------------------------------

        if (submitBtn) {

          submitBtn.disabled =
            false;

          submitBtn.textContent =
            "Send Booking Request";
        }
      }
    }
  );


  // =========================================================
  // INITIALIZE
  // =========================================================

  today = refreshToday();


  if (dateInput) {

    const initialDate =
      stringToDate(
        dateInput.value
      );


    if (
      initialDate &&
      initialDate >= today
    ) {

      if (dateDisplay) {

        if (
          "value" in dateDisplay
        ) {

          dateDisplay.value =
            formatDisplayDate(
              initialDate
            );

        } else {

          dateDisplay.textContent =
            formatDisplayDate(
              initialDate
            );
        }
      }
    }
  }


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

  console.log(
    "✅ Database column: customer_name"
  );

});
