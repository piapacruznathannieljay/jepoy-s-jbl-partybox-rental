document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // JEPOY'S JBL PARTYBOX
  // COMPLETE BOOKING SYSTEM
  //
  // Features:
  // - Custom calendar
  // - Blocks past dates
  // - GPS location
  // - Distance calculation
  // - Delivery fee calculation
  // - Google Maps location
  // - Supabase booking
  // - Status: Pending
  // - Facebook Messenger
  // =========================================================


  // =========================================================
  // BUSINESS LOCATION
  // =========================================================

  const BUSINESS_LAT = 15.989299;
  const BUSINESS_LNG = 120.2244473;


  // =========================================================
  // FORM ELEMENTS
  // =========================================================

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

  const dateDisplayText =
    document.getElementById("dateDisplayText");

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

  const calendarMonth =
    document.getElementById("calendarMonth");


  // =========================================================
  // CHECK REQUIRED ELEMENTS
  // =========================================================

  if (!bookingForm) {
    console.error("bookingForm not found.");
    return;
  }

  if (!dateDisplay) {
    console.error("dateDisplay not found.");
    return;
  }

  if (!dateInput) {
    console.error("date input not found.");
    return;
  }

  if (!calendarOverlay) {
    console.error("calendarOverlay not found.");
    return;
  }

  if (!calendarDays) {
    console.error("calendarDays not found.");
    return;
  }


  // =========================================================
  // SUPABASE CHECK
  // =========================================================

  if (
    typeof supabaseClient === "undefined" ||
    !supabaseClient
  ) {

    console.error(
      "Supabase client was not found."
    );

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

    if (
      isNaN(date.getTime())
    ) {
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


  function isSameDate(
    date1,
    date2
  ) {

    return (
      date1.getFullYear() ===
        date2.getFullYear() &&

      date1.getMonth() ===
        date2.getMonth() &&

      date1.getDate() ===
        date2.getDate()
    );

  }


  // =========================================================
  // TODAY
  // =========================================================

  let today =
    getToday();


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
  // REFRESH TODAY
  //
  // This makes sure the website does not get stuck
  // using yesterday's date if the page stays open overnight.
  // =========================================================

  function refreshToday() {

    today =
      getToday();

  }


  // =========================================================
  // UPDATE DATE DISPLAY
  // =========================================================

  function updateDateDisplay() {

    const selectedDate =
      stringToDate(
        dateInput.value
      );

    if (
      selectedDate
    ) {

      dateDisplayText.textContent =
        formatDisplayDate(
          selectedDate
        );

      dateDisplayText.classList.remove(
        "date-placeholder"
      );

      dateDisplayText.classList.add(
        "date-value"
      );

      calendarSelected.textContent =
        formatDisplayDate(
          selectedDate
        );

    } else {

      dateDisplayText.textContent =
        "Select a date";

      dateDisplayText.classList.remove(
        "date-value"
      );

      dateDisplayText.classList.add(
        "date-placeholder"
      );

      calendarSelected.textContent =
        "Select a date";

    }

  }


  // =========================================================
  // OPEN CALENDAR
  // =========================================================

  function openCalendar() {

    refreshToday();


    const selectedDate =
      stringToDate(
        dateInput.value
      );


    if (
      selectedDate &&
      selectedDate >= today
    ) {

      calendarMonth =
        new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
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


  // =========================================================
  // CLOSE CALENDAR
  // =========================================================

  function closeCalendar() {

    calendarOverlay.hidden =
      true;

    document.body.style.overflow =
      "";

  }


  // =========================================================
  // RENDER CALENDAR
  // =========================================================

  function renderCalendar() {

    refreshToday();


    const year =
      calendarMonth.getFullYear();

    const month =
      calendarMonth.getMonth();


    // =======================================================
    // MONTH TITLE
    // =======================================================

    const monthName =
      calendarMonth.toLocaleDateString(
        "en-US",
        {
          month: "long"
        }
      );


    if (calendarTitle) {

      calendarTitle.textContent =
        `${monthName} ${year}`;

    }


    if (calendarMonth) {

      calendarMonth.textContent =
        `${monthName} ${year}`;

    }


    // =======================================================
    // SELECTED DATE
    // =======================================================

    updateDateDisplay();


    // =======================================================
    // PREVIOUS MONTH
    //
    // NEVER allow going before the current month.
    // =======================================================

    const currentMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );


    if (
      calendarMonth <= currentMonth
    ) {

      calendarPrev.disabled =
        true;

    } else {

      calendarPrev.disabled =
        false;

    }


    // =======================================================
    // CLEAR CALENDAR
    // =======================================================

    calendarDays.innerHTML =
      "";


    // =======================================================
    // FIRST DAY
    // =======================================================

    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();


    // =======================================================
    // DAYS IN MONTH
    // =======================================================

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();


    // =======================================================
    // EMPTY SPACES
    // =======================================================

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


    // =======================================================
    // SELECTED DATE
    // =======================================================

    const selectedDate =
      stringToDate(
        dateInput.value
      );


    // =======================================================
    // CREATE CALENDAR DAYS
    // =======================================================

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


      // =====================================================
      // PAST DATE
      // =====================================================

      if (
        date < today
      ) {

        button.classList.add(
          "past"
        );

        button.disabled =
          true;

      }


      // =====================================================
      // TODAY
      // =====================================================

      if (
        isSameDate(
          date,
          today
        )
      ) {

        button.classList.add(
          "today"
        );

      }


      // =====================================================
      // SELECTED
      // =====================================================

      if (
        selectedDate &&
        isSameDate(
          date,
          selectedDate
        )
      ) {

        button.classList.add(
          "selected"
        );

      }


      // =====================================================
      // CLICK
      // =====================================================

      if (
        date >= today
      ) {

        button.addEventListener(
          "click",
          () => {

            selectDate(
              date
            );

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

    refreshToday();


    // NEVER allow past dates

    if (
      date < today
    ) {

      alert(
        "❌ You cannot select a date that has already passed."
      );

      return;

    }


    const value =
      dateToString(
        date
      );


    // Hidden input used by booking system

    dateInput.value =
      value;


    // Visible date

    updateDateDisplay();


    // Close calendar

    closeCalendar();

  }


  // =========================================================
  // DATE PICKER BUTTON
  // =========================================================

  dateDisplay.addEventListener(
    "click",
    () => {

      openCalendar();

    }
  );


  // =========================================================
  // PREVIOUS MONTH
  // =========================================================

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


        // Prevent going before current month

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
      () => {

        closeCalendar();

      }
    );

  }


  // =========================================================
  // TODAY BUTTON
  // =========================================================

  if (calendarToday) {

    calendarToday.addEventListener(
      "click",
      () => {

        refreshToday();

        selectDate(
          today
        );

      }
    );

  }


  // =========================================================
  // CLICK OUTSIDE CALENDAR
  // =========================================================

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


  // =========================================================
  // ESCAPE KEY
  // =========================================================

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


  // =========================================================
  // HAVERSINE DISTANCE
  // =========================================================

  function calculateDistanceKm(
    lat1,
    lon1,
    lat2,
    lon2
  ) {

    const earthRadius =
      6371;


    const dLat =
      (
        lat2 - lat1
      ) *
      Math.PI /
      180;


    const dLon =
      (
        lon2 - lon1
      ) *
      Math.PI /
      180;


    const a =
      Math.sin(
        dLat / 2
      ) ** 2 +

      Math.cos(
        lat1 * Math.PI / 180
      ) *

      Math.cos(
        lat2 * Math.PI / 180
      ) *

      Math.sin(
        dLon / 2
      ) ** 2;


    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(
          1 - a
        )
      );


    return (
      earthRadius *
      c
    );

  }


  // =========================================================
  // DELIVERY FEE
  //
  // 0 - 5 km       = FREE
  // 5.01 - 8 km   = ₱100
  // Every next 3km = +₱50
  // =========================================================

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
      Number(amount)
        .toLocaleString(
          "en-PH"
        )
    );

  }


  // =========================================================
  // LOCATION VARIABLES
  // =========================================================

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


    // Distance

    if (distanceDisplay) {

      distanceDisplay.textContent =
        `${calculatedDistanceKm.toFixed(2)} km`;

    }


    // Delivery fee

    if (feeDisplay) {

      feeDisplay.textContent =
        calculatedDeliveryFee === 0
          ? "FREE"
          : formatPeso(
              calculatedDeliveryFee
            );

    }


    // Result

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
          style="color:#d66a00;"
        >
          Open location in Google Maps
        </a>
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
        "❌ Your browser does not support location services."
      );

      return;

    }


    locationBtn.disabled =
      true;

    locationBtn.textContent =
      "📍 Getting Location...";


    navigator.geolocation.getCurrentPosition(

      // =====================================================
      // SUCCESS
      // =====================================================

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


      // =====================================================
      // ERROR
      // =====================================================

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
            "❌ Location permission was denied.\n\n" +
            "Please allow location access for this website in your browser settings.";

        }


        else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {

          message =
            "❌ Your location is currently unavailable.\n\n" +
            "Make sure GPS/location is turned on.";

        }


        else if (
          error.code ===
          error.TIMEOUT
        ) {

          message =
            "❌ Location request timed out.\n\n" +
            "Please try again.";

        }


        alert(
          message
        );

      },


      // =====================================================
      // OPTIONS
      // =====================================================

      {
        enableHighAccuracy: true,
        timeout: 20000,
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


      // =====================================================
      // REFRESH TODAY
      // =====================================================

      refreshToday();


      // =====================================================
      // DATE VALIDATION
      // =====================================================

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


        dateInput.value =
          "";

        updateDateDisplay();


        openCalendar();

        return;

      }


      // =====================================================
      // NAME
      // =====================================================

      const customerName =
        nameInput.value.trim();


      if (
        !customerName
      ) {

        alert(
          "Please enter your name."
        );

        nameInput.focus();

        return;

      }


      // =====================================================
      // PHONE
      // =====================================================

      const contactNumber =
        phoneInput.value.trim();


      if (
        !contactNumber
      ) {

        alert(
          "Please enter your contact number."
        );

        phoneInput.focus();

        return;

      }


      // =====================================================
      // PACKAGE
      // =====================================================

      const packageName =
        packageInput.value.trim();


      if (
        !packageName
      ) {

        alert(
          "Please select a package."
        );

        packageInput.focus();

        return;

      }


      // =====================================================
      // ADDRESS
      // =====================================================

      const deliveryAddress =
        addressInput.value.trim();


      if (
        !deliveryAddress
      ) {

        alert(
          "Please enter your delivery address."
        );

        addressInput.focus();

        return;

      }


      // =====================================================
      // LOCATION
      // =====================================================

      if (
        customerLatitude === null ||
        customerLongitude === null
      ) {

        alert(
          "📍 Please use your current location before sending the booking."
        );

        return;

      }


      // =====================================================
      // DELIVERY CALCULATION
      // =====================================================

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
        "undefined" ||
        !supabaseClient
      ) {

        alert(
          "❌ Supabase is not configured.\n\n" +
          "Please check config.js."
        );

        return;

      }


      // =====================================================
      // RENTAL DATE
      // =====================================================

      const rentalDate =
        dateInput.value;


      // =====================================================
      // BOOKING DATA
      //
      // IMPORTANT:
      //
      // Your Supabase column is:
      //
      // costumer_name
      //
      // NOT:
      //
      // customer_name
      //
      // =====================================================

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


      // =====================================================
      // DISABLE SUBMIT BUTTON
      // =====================================================

      submitBtn.disabled =
        true;

      submitBtn.textContent =
        "Sending Booking...";


      // =====================================================
      // SAVE TO SUPABASE
      //
      // NOTICE:
      // We intentionally DO NOT use .select()
      //
      // This means the public user only needs INSERT
      // permission.
      // =====================================================

      try {

        const {
          error
        } =
          await supabaseClient
            .from("bookings")
            .insert(
              bookingData
            );


        // ===================================================
        // SUPABASE ERROR
        // ===================================================

        if (
          error
        ) {

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


        // ===================================================
        // MESSENGER CONFIRMATION
        // ===================================================

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


        dateInput.value =
          "";


        updateDateDisplay();


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


        // ===================================================
        // RESET DISPLAY
        // ===================================================

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
            "Tap the button to detect your location.";

        }


        if (locationBtn) {

          locationBtn.disabled =
            false;

          locationBtn.textContent =
            "📍 Use My Current Location";

        }


        // ===================================================
        // RESET SUBMIT BUTTON
        // =====================================================

        submitBtn.disabled =
          false;

        submitBtn.textContent =
          "Send Booking Request";


      }


      // =====================================================
      // CATCH ERROR
      // =====================================================

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


        // ===================================================
        // COLUMN ERROR
        // ===================================================

        if (
          lowerMessage.includes(
            "could not find"
          ) &&
          lowerMessage.includes(
            "column"
          )
        ) {

          message =
            "Supabase could not find one of the booking columns.\n\n" +
            "Make sure your table uses these exact column names:\n\n" +
            "costumer_name\n" +
            "contact_number\n" +
            "package_name\n" +
            "rental_date\n" +
            "delivery_address\n" +
            "latitude\n" +
            "longitude\n" +
            "distance_km\n" +
            "delivery_fee\n" +
            "maps_link\n" +
            "status";

        }


        // ===================================================
        // RLS ERROR
        // ===================================================

        else if (
          lowerMessage.includes(
            "row-level security"
          ) ||
          lowerMessage.includes(
            "rls"
          )
        ) {

          message =
            "Supabase Row Level Security is blocking the booking.\n\n" +
            "Make sure the public INSERT policy for the bookings table has been created.";

        }


        // ===================================================
        // FAILED FETCH
        // ===================================================

        else if (
          lowerMessage.includes(
            "failed to fetch"
          )
        ) {

          message =
            "The website could not connect to Supabase.\n\n" +
            "Check your Supabase URL, publishable/anon key, internet connection, and Supabase project settings.";

        }


        // ===================================================
        // DISPLAY ERROR
        // ===================================================

        alert(
          "❌ Booking could not be saved.\n\n" +
          message
        );


        // ===================================================
        // ENABLE BUTTON AGAIN
        // ===================================================

        submitBtn.disabled =
          false;

        submitBtn.textContent =
          "Send Booking Request";

      }

    }
  );


  // =========================================================
  // INITIALIZE CALENDAR
  // =========================================================

  refreshToday();


  calendarMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );


  updateDateDisplay();


  // =========================================================
  // INITIAL CALENDAR RENDER
  // =========================================================

  renderCalendar();


  // =========================================================
  // CONSOLE
  // =========================================================

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
    "✅ Supabase column: costumer_name"
  );

});
