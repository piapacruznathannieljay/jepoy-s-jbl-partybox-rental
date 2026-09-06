document.addEventListener("DOMContentLoaded", () => {

  // =====================================================
  // JEPOY'S JBL PARTYBOX
  // COMPLETE BOOKING SCRIPT
  // =====================================================


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
  // CALENDAR ELEMENTS
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
  // CHECK REQUIRED ELEMENTS
  // =====================================================

  if (!bookingForm) {
    console.error("bookingForm not found.");
    return;
  }

  if (!dateInput) {
    console.error("date input not found.");
    return;
  }


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

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

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

    const year = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const day = Number(parts[2]);

    const date = new Date(
      year,
      month,
      day
    );

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;

  }


  function formatDisplayDate(date) {

    if (!date) {
      return "";
    }

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
  // TODAY
  // =====================================================

  let today = getToday();


  // =====================================================
  // CALENDAR STATE
  // =====================================================

  let calendarMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );


  // =====================================================
  // REFRESH TODAY
  // =====================================================

  function refreshToday() {

    today = getToday();

  }


  // =====================================================
  // SET DATE DISPLAY
  // =====================================================

  function setDateDisplay(date) {

    if (!date) {

      dateInput.value = "";

      if (dateDisplay) {

        if (
          dateDisplay.tagName === "INPUT"
        ) {

          dateDisplay.value = "";

        } else {

          dateDisplay.textContent =
            "Select Date";

        }

      }

      return;

    }


    const value =
      dateToString(date);


    dateInput.value =
      value;


    if (dateDisplay) {

      if (
        dateDisplay.tagName === "INPUT"
      ) {

        dateDisplay.value =
          formatDisplayDate(date);

      } else {

        dateDisplay.textContent =
          formatDisplayDate(date);

      }

    }

  }


  // =====================================================
  // OPEN CALENDAR
  // =====================================================

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


    if (calendarOverlay) {

      calendarOverlay.hidden =
        false;

      document.body.style.overflow =
        "hidden";

      renderCalendar();

    }

  }


  // =====================================================
  // CLOSE CALENDAR
  // =====================================================

  function closeCalendar() {

    if (calendarOverlay) {

      calendarOverlay.hidden =
        true;

    }

    document.body.style.overflow =
      "";

  }


  // =====================================================
  // RENDER CALENDAR
  // =====================================================

  function renderCalendar() {

    if (!calendarDays) {
      return;
    }


    refreshToday();


    const year =
      calendarMonth.getFullYear();

    const month =
      calendarMonth.getMonth();


    // -----------------------------------------------
    // TITLE
    // -----------------------------------------------

    if (calendarTitle) {

      calendarTitle.textContent =
        calendarMonth.toLocaleDateString(
          "en-US",
          {
            month: "long",
            year: "numeric"
          }
        );

    }


    // -----------------------------------------------
    // SELECTED DATE
    // -----------------------------------------------

    const selectedDate =
      stringToDate(
        dateInput.value
      );


    if (calendarSelected) {

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


    // -----------------------------------------------
    // CURRENT MONTH
    // -----------------------------------------------

    const currentMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );


    // -----------------------------------------------
    // PREVIOUS BUTTON
    // -----------------------------------------------

    if (calendarPrev) {

      calendarPrev.disabled =
        calendarMonth <= currentMonth;

    }


    // -----------------------------------------------
    // CLEAR CALENDAR
    // -----------------------------------------------

    calendarDays.innerHTML =
      "";


    // -----------------------------------------------
    // FIRST DAY
    // -----------------------------------------------

    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();


    // -----------------------------------------------
    // DAYS IN MONTH
    // -----------------------------------------------

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();


    // -----------------------------------------------
    // EMPTY CELLS
    // -----------------------------------------------

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


    // -----------------------------------------------
    // DAYS
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
        document.createElement("button");


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

        button.disabled =
          true;

        button.classList.add(
          "past"
        );

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
      // CLICK
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

    refreshToday();


    if (
      !date ||
      date < today
    ) {

      return;

    }


    setDateDisplay(date);

    closeCalendar();

  }


  // =====================================================
  // DATE DISPLAY CLICK
  // =====================================================

  if (dateDisplay) {

    dateDisplay.addEventListener(
      "click",
      function(event) {

        /*
        Prevent the browser's native
        date picker from opening.
        */

        event.preventDefault();

        openCalendar();

      }
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

    const earthRadius =
      6371;


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
        }</b>
        `;

    }

  }


  // =====================================================
  // GET CURRENT LOCATION
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


    if (locationBtn) {

      locationBtn.disabled =
        true;

      locationBtn.textContent =
        "📍 Getting Location...";

    }


    navigator.geolocation.getCurrentPosition(

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

  if (locationBtn) {

    locationBtn.addEventListener(
      "click",
      getCurrentLocation
    );

  }


  // =====================================================
  // CALCULATE DELIVERY BUTTON
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


      // -----------------------------------------------
      // REFRESH TODAY
      // -----------------------------------------------

      refreshToday();


      // -----------------------------------------------
      // DATE VALIDATION
      // -----------------------------------------------

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


      if (
        selectedDate < today
      ) {

        alert(
          "❌ You cannot book a date that has already passed."
        );


        setDateDisplay(null);


        openCalendar();

        return;

      }


      // -----------------------------------------------
      // NAME
      // -----------------------------------------------

      const customerName =
        nameInput
          ? nameInput.value.trim()
          : "";


      // -----------------------------------------------
      // CONTACT
      // -----------------------------------------------

      const contactNumber =
        phoneInput
          ? phoneInput.value.trim()
          : "";


      // -----------------------------------------------
      // PACKAGE
      // -----------------------------------------------

      const packageName =
        packageInput
          ? packageInput.value.trim()
          : "";


      // -----------------------------------------------
      // ADDRESS
      // -----------------------------------------------

      const deliveryAddress =
        addressInput
          ? addressInput.value.trim()
          : "";


      // -----------------------------------------------
      // BASIC VALIDATION
      // -----------------------------------------------

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


      // -----------------------------------------------
      // LOCATION VALIDATION
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
      // DELIVERY VALIDATION
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
          "❌ Supabase is not configured. Please check config.js."
        );

        return;

      }


      // -----------------------------------------------
      // BUTTON
      // -----------------------------------------------

      if (submitBtn) {

        submitBtn.disabled =
          true;

        submitBtn.textContent =
          "Sending Booking...";

      }


      // =================================================
      // IMPORTANT:
      // YOUR DATABASE COLUMN IS customer_name
      // NOT costumer_name
      // =================================================

      const bookingData = {

        customer_name:
          customerName,

        contact_number:
          contactNumber,

        package_name:
          packageName,

        rental_date:
          dateInput.value,

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

        const {
          data,
          error
        } =
          await supabaseClient
            .from("bookings")
            .insert(
              bookingData
            )
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


        // =================================================
        // SUCCESS
        // =================================================

        alert(
          "✅ BOOKING SUCCESSFUL!\n\n" +
          "Your booking request has been received.\n\n" +
          "Status: Pending\n\n" +
          "JEPOY'S JBL PARTYBOX will contact you shortly."
        );


        // =================================================
        // MESSENGER
        // =================================================

        const messengerMessage =
          `Hello JEPOY'S JBL PARTYBOX!\n\n` +

          `I would like to make a booking.\n\n` +

          `Name: ${customerName}\n` +

          `Contact: ${contactNumber}\n` +

          `Package: ${packageName}\n` +

          `Date: ${dateInput.value}\n` +

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


        // =================================================
        // RESET
        // =================================================

        bookingForm.reset();


        dateInput.value =
          "";


        if (dateDisplay) {

          if (
            dateDisplay.tagName ===
            "INPUT"
          ) {

            dateDisplay.value =
              "";

          } else {

            dateDisplay.textContent =
              "Select Date";

          }

        }


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


        if (
          message
            .toLowerCase()
            .includes(
              "row-level security"
            )
        ) {

          message =
            "Supabase Row Level Security is blocking the booking. Please check your INSERT policy.";

        }


        if (
          message
            .toLowerCase()
            .includes(
              "customer_name"
            )
        ) {

          message =
            "The database column name does not match the website. Your table should contain customer_name.";

        }


        if (
          message
            .toLowerCase()
            .includes(
              "failed to fetch"
            )
        ) {

          message =
            "The website could not connect to Supabase. Check your Supabase URL, publishable/anon key, and Supabase settings.";

        }


        alert(
          "❌ Booking could not be saved.\n\n" +
          message
        );


        if (submitBtn) {

          submitBtn.disabled =
            false;

          submitBtn.textContent =
            "Send Booking Request";

        }

      }

    }
  );


  // =====================================================
  // INITIAL DATE
  // =====================================================

  refreshToday();


  /*
  If a valid date already exists,
  show it.
  */

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

    } else {

      setDateDisplay(null);

    }

  }


  // =====================================================
  // FINAL
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

  console.log(
    "✅ Database column: customer_name"
  );

});
