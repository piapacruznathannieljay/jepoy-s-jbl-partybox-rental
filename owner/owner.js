const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let currentDate = new Date();
let bookings = [];
let selectedBooking = null;


/* ========================================
   SHORTCUT
======================================== */

const $ = (id) => {
  return document.getElementById(id);
};


/* ========================================
   DATE HELPERS
======================================== */

function pad(number) {
  return String(number).padStart(2, "0");
}

function dateKey(date) {
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate())
  );
}


/* ========================================
   LOGIN
======================================== */

async function login() {

  const email =
    $("email").value.trim();

  const password =
    $("password").value;

  $("loginMsg").textContent =
    "Signing in...";

  const {
    error
  } = await client.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {

    $("loginMsg").textContent =
      error.message;

    return;
  }

  $("loginMsg").textContent = "";

  showApp();
}


/* ========================================
   LOGOUT
======================================== */

async function logout() {

  await client.auth.signOut();

  $("app").classList.add("hidden");

  $("loginScreen")
    .classList.remove("hidden");
}


/* ========================================
   SHOW OWNER APP
======================================== */

async function showApp() {

  $("loginScreen")
    .classList.add("hidden");

  $("app")
    .classList.remove("hidden");

  await loadBookings();

  renderCalendar();
}


/* ========================================
   LOAD BOOKINGS
======================================== */

async function loadBookings() {

  $("status").textContent =
    "Loading bookings...";

  const {
    data,
    error
  } = await client
    .from("bookings")
    .select("*")
    .order("date", {
      ascending: true
    });


  if (error) {

    console.error(error);

    $("status").textContent =
      "Database error: " +
      error.message;

    bookings = [];

    return;
  }


  bookings = data || [];


  $("status").textContent =
    bookings.length +
    " booking(s) loaded.";
}


/* ========================================
   MONTH TITLE
======================================== */

function monthName(date) {

  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric"
    }
  );
}


/* ========================================
   CALENDAR
======================================== */

function renderCalendar() {

  $("monthTitle").textContent =
    monthName(currentDate);


  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();


  const firstDay =
    new Date(
      year,
      month,
      1
    );


  const startDate =
    new Date(
      year,
      month,
      1 - firstDay.getDay()
    );


  const grid =
    $("calendarGrid");


  grid.innerHTML = "";


  for (
    let i = 0;
    i < 42;
    i++
  ) {

    const date =
      new Date(startDate);


    date.setDate(
      startDate.getDate() + i
    );


    const cell =
      document.createElement("div");


    cell.className =
      "day";


    /* OTHER MONTH */

    if (
      date.getMonth() !== month
    ) {

      cell.classList.add(
        "other"
      );
    }


    /* TODAY */

    if (
      dateKey(date) ===
      dateKey(new Date())
    ) {

      cell.classList.add(
        "today"
      );
    }


    cell.innerHTML =
      `<div class="num">
        ${date.getDate()}
      </div>`;


    /* BOOKINGS FOR THIS DATE */

    const dayBookings =
      bookings.filter(
        booking => {

          return (
            String(
              booking.date
            ).substring(0, 10) ===
            dateKey(date)
          );

        }
      );


    dayBookings.forEach(
      booking => {

        const event =
          document.createElement(
            "div"
          );


        event.className =
          "event";


        const status =
          String(
            booking.status || ""
          ).toLowerCase();


        if (
          status === "confirmed"
        ) {

          event.classList.add(
            "confirmed"
          );
        }


        if (
          status === "cancelled"
        ) {

          event.classList.add(
            "cancelled"
          );
        }


        event.textContent =
          (booking.name ||
            "Booking") +
          " • " +
          (booking.package ||
            "");


        event.addEventListener(
          "click",
          function(eventObject) {

            eventObject.stopPropagation();

            openDetails(
              booking
            );
          }
        );


        cell.appendChild(
          event
        );

      }
    );


    grid.appendChild(
      cell
    );

  }


  renderBookingList();
}


/* ========================================
   BOOKING LIST
======================================== */

function renderBookingList() {

  const list =
    $("bookingList");


  list.innerHTML = "";


  if (
    !bookings.length
  ) {

    list.innerHTML =
      `<p class="muted">
        No bookings yet.
      </p>`;

    return;
  }


  const sorted =
    [...bookings].sort(
      (a, b) => {

        return String(
          a.date
        ).localeCompare(
          String(b.date)
        );

      }
    );


  sorted.forEach(
    booking => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "booking";


      item.innerHTML = `

        <div class="info">

          <h3>
            ${escapeHTML(
              booking.name ||
              "Unnamed customer"
            )}
          </h3>

          <div class="muted">

            ${escapeHTML(
              booking.date ||
              "No date"
            )}

            • 

            ${escapeHTML(
              booking.package ||
              "No package"
            )}

            <br>

            ${escapeHTML(
              booking.phone ||
              ""
            )}

            <br>

            ${escapeHTML(
              booking.address ||
              ""
            )}

          </div>

        </div>

        <span class="badge">

          ${escapeHTML(
            booking.status ||
            "pending"
          )}

        </span>

        <button
          class="smallBtn"
          type="button"
        >
          View
        </button>

      `;


      item
        .querySelector(
          "button"
        )
        .addEventListener(
          "click",
          function() {

            openDetails(
              booking
            );

          }
        );


      list.appendChild(
        item
      );

    }
  );
}


/* ========================================
   ESCAPE HTML
======================================== */

function escapeHTML(value) {

  return String(
    value ?? ""
  ).replace(
    /[&<>"']/g,
    function(character) {

      const characters = {

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

      };

      return characters[
        character
      ];

    }
  );
}


/* ========================================
   OPEN BOOKING DETAILS
======================================== */

function openDetails(
  booking
) {

  selectedBooking =
    booking;


  $("detailName")
    .textContent =
    booking.name ||
    "Booking";


  $("detailBody")
    .innerHTML = `

      <p>
        <b>Date:</b>
        ${escapeHTML(
          booking.date
        )}
      </p>

      <p>
        <b>Package:</b>
        ${escapeHTML(
          booking.package
        )}
      </p>

      <p>
        <b>Contact:</b>
        ${escapeHTML(
          booking.phone
        )}
      </p>

      <p>
        <b>Address:</b>
        ${escapeHTML(
          booking.address
        )}
      </p>

      <p>
        <b>Distance:</b>
        ${escapeHTML(
          booking.distance ||
          "Not recorded"
        )}
      </p>

      <p>
        <b>Delivery fee:</b>
        ${escapeHTML(
          booking.delivery_fee ||
          "Not recorded"
        )}
      </p>

      <p>
        <b>Status:</b>
        ${escapeHTML(
          booking.status ||
          "pending"
        )}
      </p>

    `;


  /* CALL */

  $("callBtn").href =
    "tel:" +
    (
      booking.phone ||
      ""
    );


  /* MAP */

  let mapLink =
    booking.maps_link;


  if (
    !mapLink &&
    booking.lat &&
    booking.lng
  ) {

    mapLink =
      "https://www.google.com/maps?q=" +
      booking.lat +
      "," +
      booking.lng;
  }


  $("mapBtn").href =
    mapLink || "#";


  $("detailsModal")
    .classList.remove(
      "hidden"
    );
}


/* ========================================
   CHANGE BOOKING STATUS
======================================== */

async function setStatus(
  status
) {

  if (
    !selectedBooking
  ) {

    return;
  }


  const {
    error
  } = await client
    .from("bookings")
    .update({
      status: status
    })
    .eq(
      "id",
      selectedBooking.id
    );


  if (error) {

    alert(
      error.message
    );

    return;
  }


  $("detailsModal")
    .classList.add(
      "hidden"
    );


  await loadBookings();

  renderCalendar();
}


/* ========================================
   BUTTONS
======================================== */

$("loginBtn")
  .addEventListener(
    "click",
    login
  );


$("logoutBtn")
  .addEventListener(
    "click",
    logout
  );


$("prevBtn")
  .addEventListener(
    "click",
    function() {

      currentDate.setMonth(
        currentDate.getMonth() - 1
      );

      renderCalendar();

    }
  );


$("nextBtn")
  .addEventListener(
    "click",
    function() {

      currentDate.setMonth(
        currentDate.getMonth() + 1
      );

      renderCalendar();

    }
  );


$("todayBtn")
  .addEventListener(
    "click",
    function() {

      currentDate =
        new Date();

      renderCalendar();

    }
  );


$("refreshBtn")
  .addEventListener(
    "click",
    async function() {

      await loadBookings();

      renderCalendar();

    }
  );


$("closeModal")
  .addEventListener(
    "click",
    function() {

      $("detailsModal")
        .classList.add(
          "hidden"
        );

    }
  );


$("confirmBtn")
  .addEventListener(
    "click",
    function() {

      setStatus(
        "confirmed"
      );

    }
  );


$("cancelBtn")
  .addEventListener(
    "click",
    function() {

      setStatus(
        "cancelled"
      );

    }
  );


$("detailsModal")
  .addEventListener(
    "click",
    function(event) {

      if (
        event.target.id ===
        "detailsModal"
      ) {

        $("detailsModal")
          .classList.add(
            "hidden"
          );

      }

    }
  );


/* ========================================
   CHECK EXISTING LOGIN
======================================== */

client.auth
  .getSession()
  .then(
    function(result) {

      if (
        result.data &&
        result.data.session
      ) {

        showApp();

      }

    }
  );
