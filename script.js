// ========================================
// JEPOY'S JBL PARTYBOX
// CUSTOMER BOOKING SYSTEM
// GPS + DELIVERY + SUPABASE
// ========================================

// BUSINESS LOCATION
const BUSINESS_LAT = 15.989299;
const BUSINESS_LNG = 120.2244473;

// Customer GPS
let customerGPS = null;

// Calculated booking information
let calculatedDistance = null;
let calculatedFee = null;


// ========================================
// ELEMENTS
// ========================================

const bookingForm = document.getElementById("bookingForm");
const locationButton = document.getElementById("locationBtn");
const calculateButton = document.getElementById("calc");

const resultElement = document.getElementById("result");
const distanceElement = document.getElementById("distance");
const feeElement = document.getElementById("fee");


// ========================================
// STRAIGHT-LINE DISTANCE
// ========================================

function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );
}


// ========================================
// ROAD DISTANCE
// ========================================

async function calculateRoadDistance(
    customerLat,
    customerLng
) {

    const url =
        "https://router.project-osrm.org/route/v1/driving/" +
        BUSINESS_LNG + "," + BUSINESS_LAT +
        ";" +
        customerLng + "," + customerLat +
        "?overview=false";

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Road distance service unavailable."
        );
    }

    const data = await response.json();

    if (
        data.code !== "Ok" ||
        !data.routes ||
        data.routes.length === 0
    ) {
        throw new Error(
            "No driving route found."
        );
    }

    return data.routes[0].distance / 1000;
}


// ========================================
// DELIVERY FEE
// ========================================
//
// 0–5 km = FREE
// 5.01–8 km = ₱100
// Every additional 3 km = +₱50
//
// ========================================

function calculateDeliveryFee(km) {

    if (km <= 5) {
        return 0;
    }

    if (km <= 8) {
        return 100;
    }

    return 100 +
        Math.ceil((km - 8) / 3) * 50;
}


// ========================================
// GET CURRENT LOCATION
// ========================================

function getCustomerLocation() {

    if (!navigator.geolocation) {

        resultElement.textContent =
            "❌ GPS is not supported by this browser.";

        return;
    }

    resultElement.textContent =
        "📍 Getting your current location...";

    locationButton.disabled = true;

    navigator.geolocation.getCurrentPosition(

        async function(position) {

            customerGPS = {

                lat: position.coords.latitude,

                lng: position.coords.longitude
            };

            resultElement.innerHTML =
                "📍 Location found.<br><br>" +
                "🚗 Calculating delivery distance...";

            try {

                await calculateDelivery();

            } catch (error) {

                console.error(error);

                resultElement.innerHTML =
                    "⚠️ GPS location found, but " +
                    "the road distance could not be calculated.<br><br>" +
                    "Trying straight-line distance...";

                try {

                    const distance =
                        calculateDistance(
                            BUSINESS_LAT,
                            BUSINESS_LNG,
                            customerGPS.lat,
                            customerGPS.lng
                        );

                    showDeliveryResult(distance);

                } catch (fallbackError) {

                    resultElement.textContent =
                        "❌ Unable to calculate delivery distance.";
                }
            }

            locationButton.disabled = false;
        },

        function(error) {

            locationButton.disabled = false;

            if (error.code === 1) {

                resultElement.innerHTML =
                    "❌ Location permission was denied.<br><br>" +
                    "Please allow location access for this website " +
                    "in your browser settings.";

            } else if (error.code === 2) {

                resultElement.textContent =
                    "❌ Your location is unavailable. " +
                    "Please turn on Location/GPS and try again.";

            } else if (error.code === 3) {

                resultElement.textContent =
                    "❌ Location request timed out. " +
                    "Please try again.";

            } else {

                resultElement.textContent =
                    "❌ Unable to get your location.";
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0
        }
    );
}


// ========================================
// CALCULATE DELIVERY
// ========================================

async function calculateDelivery() {

    if (!customerGPS) {

        resultElement.innerHTML =
            "📍 Please tap <strong>" +
            "Use My Current Location</strong> first.";

        return;
    }

    resultElement.innerHTML =
        "🚗 Calculating driving distance...";

    let distance;

    try {

        distance =
            await calculateRoadDistance(
                customerGPS.lat,
                customerGPS.lng
            );

    } catch (error) {

        console.warn(
            "Road distance failed:",
            error
        );

        distance =
            calculateDistance(
                BUSINESS_LAT,
                BUSINESS_LNG,
                customerGPS.lat,
                customerGPS.lng
            );

        resultElement.innerHTML =
            "⚠️ Road distance unavailable.<br>" +
            "Using approximate distance instead.<br><br>";
    }

    showDeliveryResult(distance);
}


// ========================================
// DISPLAY DELIVERY RESULT
// ========================================

function showDeliveryResult(distance) {

    calculatedDistance =
        Number(distance.toFixed(2));

    calculatedFee =
        calculateDeliveryFee(calculatedDistance);

    if (distanceElement) {

        distanceElement.textContent =
            calculatedDistance.toFixed(2) +
            " km";
    }

    if (feeElement) {

        feeElement.textContent =
            calculatedFee === 0
                ? "FREE"
                : "₱" +
                  calculatedFee.toLocaleString();
    }

    const mapsLink =
        "https://www.google.com/maps?q=" +
        customerGPS.lat +
        "," +
        customerGPS.lng;

    resultElement.innerHTML =

        "📍 Distance: <strong>" +
        calculatedDistance.toFixed(2) +
        " km</strong><br><br>" +

        "🚚 Delivery Fee: <strong>" +

        (
            calculatedFee === 0
                ? "FREE"
                : "₱" +
                  calculatedFee.toLocaleString()
        ) +

        "</strong><br><br>" +

        "🗺️ <a href=\"" +
        mapsLink +
        "\" target=\"_blank\" rel=\"noopener\">" +
        "Open Customer Location in Google Maps" +
        "</a>";
}


// ========================================
// SEND BOOKING TO SUPABASE
// ========================================

async function sendBookingToSupabase() {

    // Check configuration
    if (
        typeof SUPABASE_URL === "undefined" ||
        typeof SUPABASE_ANON_KEY === "undefined" ||
        !SUPABASE_URL ||
        !SUPABASE_ANON_KEY
    ) {

        throw new Error(
            "Supabase configuration is missing. " +
            "Please update config.js."
        );
    }

    if (!customerGPS) {

        throw new Error(
            "Please select your current location first."
        );
    }

    if (
        calculatedDistance === null ||
        calculatedFee === null
    ) {

        throw new Error(
            "Please calculate the delivery fee first."
        );
    }

    const name =
        document.getElementById("name").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const packageName =
        document.getElementById("package").value;

    const date =
        document.getElementById("date").value;

    const address =
        document.getElementById("address").value.trim();

    const mapsLink =
        "https://www.google.com/maps?q=" +
        customerGPS.lat +
        "," +
        customerGPS.lng;


    const bookingData = {

        customer_name: name,

        phone: phone,

        package_name: packageName,

        booking_date: date,

        delivery_address: address,

        latitude: customerGPS.lat,

        longitude: customerGPS.lng,

        distance_km: calculatedDistance,

        delivery_fee: calculatedFee,

        maps_link: mapsLink,

        status: "pending",

        private_notes: ""
    };


    const response = await fetch(
        SUPABASE_URL +
        "/rest/v1/bookings",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json",

                "apikey":
                    SUPABASE_ANON_KEY,

                "Authorization":
                    "Bearer " +
                    SUPABASE_ANON_KEY,

                "Prefer":
                    "return=representation"
            },

            body:
                JSON.stringify(bookingData)
        }
    );


    if (!response.ok) {

        let errorMessage =
            "Unable to save booking.";

        try {

            const errorData =
                await response.json();

            console.error(
                "Supabase error:",
                errorData
            );

            if (errorData.message) {

                errorMessage =
                    errorData.message;

            } else if (errorData.error) {

                errorMessage =
                    errorData.error;
            }

        } catch (error) {

            console.error(error);
        }

        throw new Error(errorMessage);
    }


    return await response.json();
}


// ========================================
// BOOKING FORM
// ========================================

if (bookingForm) {

    bookingForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            // Browser validation
            if (!bookingForm.checkValidity()) {

                bookingForm.reportValidity();

                return;
            }


            // GPS check
            if (!customerGPS) {

                alert(
                    "Please tap " +
                    "'Use My Current Location' " +
                    "before sending your booking."
                );

                return;
            }


            // Delivery calculation check
            if (
                calculatedDistance === null ||
                calculatedFee === null
            ) {

                alert(
                    "Please tap " +
                    "'Calculate Delivery' " +
                    "first."
                );

                return;
            }


            const submitButton =
                bookingForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "SENDING BOOKING...";
            }


            resultElement.innerHTML =
                "📨 Sending your booking...";


            try {

                await sendBookingToSupabase();


                resultElement.innerHTML =

                    "✅ <strong>Booking sent successfully!</strong>" +
                    "<br><br>" +

                    "Your booking has been received by " +
                    "JEPOY'S JBL PARTYBOX." +
                    "<br><br>" +

                    "We will review your booking and " +
                    "contact you shortly.";


                alert(
                    "Booking sent successfully! " +
                    "We will contact you shortly."
                );


                // Reset form after successful booking
                bookingForm.reset();

                customerGPS = null;

                calculatedDistance = null;

                calculatedFee = null;


                if (distanceElement) {

                    distanceElement.textContent = "—";
                }

                if (feeElement) {

                    feeElement.textContent = "—";
                }


            } catch (error) {

                console.error(
                    "BOOKING ERROR:",
                    error
                );


                resultElement.innerHTML =

                    "❌ <strong>Booking was not sent.</strong>" +
                    "<br><br>" +

                    error.message;


                alert(
                    "The booking could not be sent.\n\n" +
                    error.message
                );


            } finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "SEND BOOKING";
                }
            }
        }
    );
}


// ========================================
// BUTTONS
// ========================================

if (locationButton) {

    locationButton.addEventListener(
        "click",
        getCustomerLocation
    );
}


if (calculateButton) {

    calculateButton.addEventListener(
        "click",
        calculateDelivery
    );
}


// ========================================
// PAGE READY
// ========================================

console.log(
    "JEPOY'S JBL PARTYBOX booking system loaded."
);
