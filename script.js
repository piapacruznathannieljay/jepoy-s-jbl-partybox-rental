/*
=========================================================
JEPOY'S JBL PARTYBOX
COMPLETE BOOKING SYSTEM
=========================================================

FEATURES:
✓ Supabase booking
✓ customer_name column
✓ No .select()
✓ Custom calendar
✓ Past dates blocked
✓ Dynamic current date
✓ GPS location
✓ Distance calculation
✓ Delivery fee calculation
✓ Google Maps link
✓ Messenger booking message
✓ Pending booking status
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

  console.log("JEPOY'S JBL PARTYBOX booking system starting...");

  // =====================================================
  // BUSINESS LOCATION
  // =====================================================

  const BUSINESS_LAT = 15.989299;
  const BUSINESS_LNG = 120.2244473;


  // =====================================================
  // GET ELEMENTS
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
  // BASIC CHECK
  // =====================================================

  if (!bookingForm) {

    console.error(
      "ERROR: bookingForm was not found."
    );

    return;

  }


  // =====================================================
  // FIX DATE INPUT
  // =====================================================
  /*
  If the HTML still contains:

  <input type="date" id="date">

  Android may open its native calendar.

  We change it to hidden so our own calendar
  controls the date.
  */

  if (dateInput) {

    dateInput.type = "hidden";

  }


  /*
  If dateDisplay is an input, make it a normal
  text field instead of a native date field.
  */

  if (
    dateDisplay &&
    dateDisplay.tagName === "INPUT"
  ) {

    dateDisplay.type = "text";

    dateDisplay.readOnly = true;

    dateDisplay.setAttribute(
      "autocomplete",
      "off"
    );

    dateDisplay.setAttribute(
      "inputmode",
      "none"
    );

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

    if (
      parts.length !== 3
    ) {

      return null;

    }

    const year =
      Number(parts[0]);

    const month =
      Number(parts[1]) - 1;

    const day =
      Number(parts[2]);

    if (
      !year ||
      month < 0 ||
      day < 1
    ) {

      return null;

    }

    const date =
      new Date(
        year,
        month,
        day
      );

    /*
    Make sure JavaScript didn't
    automatically change an invalid date.
    */

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

    return date.toLocaleDateString(
      "en-US",
      {
        month: "long",
        day: "numeric",
        year: "numeric"
      }
    );

  }


  function setDateDisplay(date) {

    if (!dateDisplay) {

      return;

    }

    const text =
      formatDisplayDate(date);


    if (
      dateDisplay.tagName === "INPUT" ||
      dateDisplay.tagName === "TEXTAREA"
    ) {

      dateDisplay.value =
        text;

    } else {

      dateDisplay.textContent =
        text;

    }

  }


  function getDateDisplayValue() {

    if (!dateDisplay) {

      return "";

    }

    if (
      dateDisplay.tagName === "INPUT" ||
      dateDisplay.tagName === "TEXTAREA"
    ) {

      return dateDisplay.value;

    }

    return dateDisplay.textContent;

  }


  function clearDateDisplay() {

    if (!dateDisplay) {

      return;

    }

    if (
      dateDisplay.tagName === "INPUT" ||
      dateDisplay.tagName === "TEXTAREA"
    ) {

      dateDisplay.value = "";

    } else {

      dateDisplay.textContent =
        "Select Date";

    }

  }


  // =====================================================
  // CALENDAR STATE
  // =====================================================

  let calendarMonth =
    new Date(
      getToday().getFullYear(),
      getToday().getMonth(),
      1
    );


  // =====================================================
  // OPEN CALENDAR
  // =====================================================

  function openCalendar() {

    if (
      !calendarOverlay ||
      !calendarDays
    ) {

      /*
      If custom calendar HTML is missing,
      show a clear message instead of crashing.
      */

      alert(
        "The custom calendar is not available. Please check index.html."
      );

      return;

    }


    const today =
      getToday();


    /*
    Read currently selected date.
    */

    const selected =
      stringToDate(
        dateInput
          ? dateInput.value
          : ""
      );


    /*
    If there is a valid selected date,
    open that month.

    Otherwise always open the CURRENT month.
    */

    if (
      selected &&
      selected >= today
    ) {

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

    calendarOverlay.style.display =
      "flex";

    document.body.style.overflow =
      "hidden";

    renderCalendar();

  }


  // =====================================================
  // CLOSE CALENDAR
  // =====================================================

  function closeCalendar() {

    if (!calendarOverlay) {

      return;

    }

    calendarOverlay.hidden =
      true;

    calendarOverlay.style.display =
      "none";

    document.body.style.overflow =
      "";

  }


  // =====================================================
  // RENDER CALENDAR
  // =====================================================

  function renderCalendar() {

    if (
      !calendarOverlay ||
      !calendarDays
    ) {

      return;

    }


    const today =
      getToday();


    const year =
      calendarMonth.getFullYear();

    const month =
      calendarMonth.getMonth();


    // =================================================
    // TITLE
    // =================================================

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


    // =================================================
    // SELECTED DATE
    // =================================================

    const selectedDate =
      stringToDate(
        dateInput
          ? dateInput.value
          : ""
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


    // =================================================
    // PREVIOUS MONTH BUTTON
    // =================================================

    const currentMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );


    const isCurrentMonth =
      calendarMonth.getFullYear() ===
        currentMonth.getFullYear() &&
      calendarMonth.getMonth() ===
        currentMonth.getMonth();


    if (calendarPrev) {

      calendarPrev.disabled =
        isCurrentMonth;

    }


    // =================================================
    // CLEAR OLD DAYS
    // =================================================

    calendarDays.innerHTML =
      "";


    // =================================================
    // FIRST DAY
    // =================================================

    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();


    // =================================================
    // DAYS IN MONTH
    // =================================================

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();


    // =================================================
    // EMPTY DAYS
    // =================================================

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


    // =================================================
    // CREATE DAY BUTTONS
    // =================================================

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


      // =================================================
      // PAST DATE
      // =================================================

      if (
        date < today
      ) {

        button.disabled =
          true;

        button.classList.add(
          "past"
        );

      }


      // =================================================
      // TODAY
      // =================================================

      if (
        date.getTime() ===
        today.getTime()
      ) {

        button.classList.add(
          "today"
        );

      }


      // =================================================
      // SELECTED DATE
      // =================================================

      if (
        selectedDate &&
        date.getTime() ===
        selectedDate.getTime()
      ) {

        button.classList.add(
          "selected"
        );

      }


      // =================================================
      // CLICK DATE
      // =================================================

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

    const today =
      getToday();


    /*
    Absolute protection against
    selecting a past date.
    */

    if (
      date < today
    ) {

      alert(
        "You cannot select a date that has already passed."
      );

      return;

    }


    const value =
      dateToString(date);


    // =================================================
    // HIDDEN SUPABASE VALUE
    // =================================================

    if (dateInput) {

      dateInput.value =
        value;

    }


    // =================================================
    // VISIBLE DATE
    // =================================================

    setDateDisplay(date);


    if (calendarSelected) {

      calendarSelected.textContent =
        formatDisplayDate(date);

    }


    closeCalendar();

  }


  // =====================================================
  // DATE DISPLAY CLICK
  // =====================================================

  if (dateDisplay) {

    dateDisplay.addEventListener(
      "click",
      event => {

        event.preventDefault();

        event.stopPropagation();

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
      event => {

        event.preventDefault();


        const today =
          getToday();


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
        Never allow calendar
        to go before current month.
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

  }


  // =====================================================
  // NEXT MONTH
  // =====================================================

  if (calendarNext) {

    calendarNext.addEventListener(
      "click",
      event => {

        event.preventDefault();


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
      event => {

        event.preventDefault();

        closeCalendar();

      }
    );

  }


  // =====================================================
  // TODAY BUTTON
  // =====================================================

  if (calendarToday) {

    calendarToday.addEventListener(
      "click",
      event => {

        event.preventDefault();

        selectDate(
          getToday()
        );

      }
    );

  }


  // =====================================================
  // CLICK OUTSIDE CALENDAR
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
  // ESCAPE KEY
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
        Math.sqrt(1 - a)
      );


    return (
      earthRadius * c
    );

  }


  // =====================================================
  // DELIVERY FEE
  // =====================================================
  /*
  0 - 5 km       = FREE
  5.01 - 8 km    = ₱100
  Every next 3km = +₱50
  */

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
  // UPDATE LOCATION DISPLAY
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


    // =================================================
    // DISTANCE DISPLAY
    // =================================================

    if (distanceDisplay) {

      distanceDisplay.textContent =
        `${calculatedDistanceKm.toFixed(2)} km`;

    }


    // =================================================
    // FEE DISPLAY
    // =================================================

    if (feeDisplay) {

      feeDisplay.textContent =
        calculatedDeliveryFee === 0
          ? "FREE"
          : formatPeso(
              calculatedDeliveryFee
            );

    }


    // =================================================
    // RESULT DISPLAY
    // =================================================

    if (resultDisplay) {

      resultDisplay.innerHTML =
        `
        📍 Location detected.<br>
        Distance:
        <b>${calculatedDistanceKm.toFixed(2)} km</b><br>
        Delivery fee:
        <b>
        ${
          calculatedDeliveryFee === 0
            ? "FREE"
            : formatPeso(
                calculatedDeliveryFee
              )
        }
        </b>
        `;

    }


    console.log(
      "Customer location:",
      customerLatitude,
      customerLongitude
    );

    console.log(
      "Distance:",
      calculatedDistanceKm
    );

    console.log(
      "Delivery fee:",
      calculatedDeliveryFee
    );

    console.log(
      "Google Maps:",
      googleMapsLink
    );

  }


  // =====================================================
  // GET CURRENT GPS LOCATION
  // =====================================================

  function getCurrentLocation() {

    if (
      !navigator.geolocation
    ) {

      alert(
        "Your browser does not support GPS location."
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

      // =================================================
      // SUCCESS
      // =================================================

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


      // =================================================
      // ERROR
      // =================================================

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
            "❌ Location permission was denied.\n\n" +
            "Please allow location access for this website in your browser settings.";

        }


        else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {

          message =
            "❌ Your location is currently unavailable.\n\n" +
            "Please make sure your phone's Location/GPS is turned on.";

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


      // =================================================
      // GPS OPTIONS
      // =================================================

      {
        enableHighAccuracy: true,
        timeout: 20000,
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
      event => {

        event.preventDefault();

        getCurrentLocation();

      }
    );

  }


  // =====================================================
  // CALCULATE DELIVERY BUTTON
  // =====================================================

  if (calculateBtn) {

    calculateBtn.addEventListener(
      "click",
      event => {

        event.preventDefault();


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


      console.log(
        "Booking form submitted."
      );


      // =================================================
      // GET TODAY AGAIN
      // =================================================

      const today =
        getToday();


      // =================================================
      // DATE VALIDATION
      // =================================================

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


      /*
      Block dates that are in the past.
      */

      if (
        selectedDate < today
      ) {

        alert(
          "❌ You cannot book a date that has already passed."
        );


        if (dateInput) {

          dateInput.value =
            "";

        }


        clearDateDisplay();


        openCalendar();

        return;

      }


      // =================================================
      // CUSTOMER NAME
      // =================================================

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


      // =================================================
      // CONTACT
      // =================================================

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


      // =================================================
      // PACKAGE
      // =================================================

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


      // =================================================
      // ADDRESS
      // =================================================

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


      // =================================================
      // GPS VALIDATION
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
      // DELIVERY VALIDATION
      // =================================================

      if (
        calculatedDistanceKm === null ||
        calculatedDeliveryFee === null
      ) {

        alert(
          "Please calculate your delivery first."
        );

        return;

      }


      // =================================================
      // SUPABASE CHECK
      // =================================================

      if (
        typeof supabaseClient ===
        "undefined"
      ) {

        alert(
          "❌ Supabase is not configured.\n\nPlease check your config.js file."
        );

        console.error(
          "supabaseClient is undefined."
        );

        return;

      }


      // =================================================
      // SUPABASE URL / KEY CHECK
      // =================================================

      if (
        typeof SUPABASE_URL !==
        "undefined"
      ) {

        if (
          SUPABASE_URL.includes(
            "PASTE_YOUR"
          )
        ) {

          alert(
            "❌ Your Supabase URL is still a placeholder."
          );

          return;

        }

      }


      // =================================================
      // DISABLE SUBMIT BUTTON
      // =================================================

      if (submitBtn) {

        submitBtn.disabled =
          true;

        submitBtn.textContent =
          "Sending Booking...";

      }


      // =================================================
      // BOOKING DATA
      // =================================================
      /*
      IMPORTANT:

      Your Supabase column is:

      customer_name

      NOT:

      costumer_name

      */

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
        "================================="
      );

      console.log(
        "BOOKING DATA BEING SENT:"
      );

      console.log(
        bookingData
      );

      console.log(
        "================================="
      );


      // =================================================
      // SAVE TO SUPABASE
      // =================================================

      try {

        /*
        IMPORTANT:

        There is NO .select() here.

        This only INSERTS the booking.
        */

        const {
          error
        } =
          await supabaseClient
            .from("bookings")
            .insert([
              bookingData
            ]);


        // =================================================
        // SUPABASE ERROR
        // =================================================

        if (error) {

          console.error(
            "SUPABASE INSERT ERROR:"
          );

          console.error(
            error
          );


          throw new Error(
            error.message ||
            "Supabase could not save the booking."
          );

        }


        // =================================================
        // SUCCESS
        // =================================================

        console.log(
          "✅ BOOKING SUCCESSFULLY SAVED."
        );


        // =================================================
        // SUCCESS MESSAGE
        // =================================================

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
          "Hello JEPOY'S JBL PARTYBOX!\n\n" +

          "I would like to make a booking.\n\n" +

          "Name: " +
          customerName +
          "\n" +

          "Contact: " +
          contactNumber +
          "\n" +

          "Package: " +
          packageName +
          "\n" +

          "Date: " +
          rentalDate +
          "\n" +

          "Address: " +
          deliveryAddress +
          "\n" +

          "Distance: " +
          calculatedDistanceKm +
          " km\n" +

          "Delivery Fee: " +
          (
            calculatedDeliveryFee === 0
              ? "FREE"
              : formatPeso(
                  calculatedDeliveryFee
                )
          ) +
          "\n\n" +

          "Google Maps Location:\n" +

          googleMapsLink;


        const messengerURL =
          "https://m.me/1218332498024792?text=" +
          encodeURIComponent(
            messengerMessage
          );


        // =================================================
        // ASK ABOUT MESSENGER
        // =================================================

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
        // RESET FORM
        // =================================================

        bookingForm.reset();


        if (dateInput) {

          dateInput.value =
            "";

        }


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


        // =================================================
        // RESET LOCATION DISPLAY
        // =================================================

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


        // =================================================
        // RESET CALENDAR
        // =================================================

        const freshToday =
          getToday();


        calendarMonth =
          new Date(
            freshToday.getFullYear(),
            freshToday.getMonth(),
            1
          );


      }


      // =================================================
      // ERROR
      // =================================================

      catch (error) {

        console.error(
          "================================="
        );

        console.error(
          "BOOKING ERROR:"
        );

        console.error(
          error
        );

        console.error(
          "================================="
        );


        let message =
          error &&
          error.message
            ? error.message
            : "Unknown error";


        const lowerMessage =
          message.toLowerCase();


        // =================================================
        // RLS ERROR
        // =================================================

        if (
          lowerMessage.includes(
            "row-level security"
          )
        ) {

          message =
            "Supabase Row Level Security is blocking the booking.\n\n" +
            "The website code is reaching Supabase, but the database is refusing the INSERT.";

        }


        // =================================================
        // COLUMN ERROR
        // =================================================

        else if (
          lowerMessage.includes(
            "customer_name"
          ) &&
          lowerMessage.includes(
            "could not find"
          )
        ) {

          message =
            "Supabase cannot find the customer_name column.\n\n" +
            "Make sure your bookings table has a column named exactly:\n\n" +
            "customer_name";

        }


        // =================================================
        // SCHEMA CACHE
        // =================================================

        else if (
          lowerMessage.includes(
            "schema cache"
          )
        ) {

          message =
            "Supabase's API schema cache does not recognize one of the booking columns yet.\n\n" +
            "Run this in Supabase SQL Editor:\n\n" +
            "NOTIFY pgrst, 'reload schema';";

        }


        // =================================================
        // FAILED FETCH
        // =================================================

        else if (
          lowerMessage.includes(
            "failed to fetch"
          )
        ) {

          message =
            "The website could not connect to Supabase.\n\n" +
            "Check your Supabase URL, API key, internet connection, and Supabase project.";

        }


        // =================================================
        // PERMISSION
        // =================================================

        else if (
          lowerMessage.includes(
            "permission"
          ) ||
          lowerMessage.includes(
            "not allowed"
          )
        ) {

          message =
            "Supabase is refusing permission to create the booking.\n\n" +
            "Check the INSERT policy and permissions for the anon role.";

        }


        // =================================================
        // SHOW ERROR
        // =================================================

        alert(
          "❌ Booking could not be saved.\n\n" +
          message
        );


        // =================================================
        // ENABLE BUTTON
        // =================================================

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
  // INITIALIZE DATE
  // =====================================================

  const today =
    getToday();


  /*
  If the HTML accidentally contains
  an old/past date, remove it.
  */

  if (dateInput && dateInput.value) {

    const existingDate =
      stringToDate(
        dateInput.value
      );


    if (
      !existingDate ||
      existingDate < today
    ) {

      dateInput.value =
        "";

      clearDateDisplay();

    }

    else {

      setDateDisplay(
        existingDate
      );

    }

  }


  // =====================================================
  // INITIALIZE CALENDAR MONTH
  // =====================================================

  calendarMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );


  // =====================================================
  // HIDE CALENDAR INITIALLY
  // =====================================================

  if (calendarOverlay) {

    calendarOverlay.hidden =
      true;

    calendarOverlay.style.display =
      "none";

  }


  // =====================================================
  // FINAL LOGS
  // =====================================================

  console.log(
    "================================="
  );

  console.log(
    "✅ JEPOY'S JBL PARTYBOX"
  );

  console.log(
    "✅ Booking system loaded."
  );

  console.log(
    "✅ customer_name column enabled."
  );

  console.log(
    "✅ Supabase INSERT without .select()."
  );

  console.log(
    "✅ Past dates blocked."
  );

  console.log(
    "✅ Custom calendar enabled."
  );

  console.log(
    "✅ GPS enabled."
  );

  console.log(
    "✅ Distance calculation enabled."
  );

  console.log(
    "✅ Delivery fee calculation enabled."
  );

  console.log(
    "✅ Google Maps link enabled."
  );

  console.log(
    "✅ Messenger booking enabled."
  );

  console.log(
    "================================="
  );

});
