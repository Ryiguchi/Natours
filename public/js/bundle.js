const $ca6382f54d121199$export$4c5dd147b21b9176 = (locations)=>{
    mapboxgl.accessToken = "pk.eyJ1IjoicnltZWxhIiwiYSI6ImNsZ2o2Zjd0YjAwZm8zZ3FzNzJ2a3g2MnoifQ.MlfIu_7sSZezmGYUs02ZPQ";
    // 2) Define new map
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/rymela/clgj89h3z006z01qx9e128675",
        scrollZoom: false
    });
    // 3) Create bounds object
    const bounds = new mapboxgl.LngLatBounds();
    // 4) Create markers for all locations
    locations.forEach((loc)=>{
        // 1) Create marker
        const el = document.createElement("div");
        el.className = "marker";
        // 2) Add marker
        new mapboxgl.Marker({
            element: el,
            // bottom of el (pin) will be placed on the location
            anchor: "bottom"
        }).setLngLat(loc.coordinates).addTo(map);
        // 3) Add label
        new mapboxgl.Popup({
            offset: 30
        }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);
        // 4) extend map bounds to include the current location
        bounds.extend(loc.coordinates);
    });
    // 5) Fit map to bounds and add padding
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
    // 6) Add zoom controls
    const controls = new mapboxgl.NavigationControl();
    map.addControl(controls, "bottom-left");
};


const $d538d880fa30d5f5$export$516836c6a9dfc573 = ()=>{
    const el = document.querySelector(".alert");
    if (el) el.parentElement.removeChild(el);
};
const $d538d880fa30d5f5$export$de026b00723010c1 = (type, msg)=>{
    $d538d880fa30d5f5$export$516836c6a9dfc573();
    const markup = `
    <div class="alert alert--${type}">${msg}</div>
  `;
    document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
    window.setTimeout($d538d880fa30d5f5$export$516836c6a9dfc573, 5000);
};


const $4fc3a66658866aad$export$596d806903d1f59e = async (email, password)=>{
    try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/users/login", {
            method: "POST",
            headers: {
                "content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        const data = await res.json();
        if (res.ok) {
            (0, $d538d880fa30d5f5$export$de026b00723010c1)("success", "Logged in successfully!");
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        } else throw new Error(data.message);
    } catch (error) {
        (0, $d538d880fa30d5f5$export$de026b00723010c1)("error", error.message);
    }
};
const $4fc3a66658866aad$export$a0973bcfe11b05c9 = async ()=>{
    try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/users/logout");
        const data = await res.json();
        if (res.ok) {
            (0, $d538d880fa30d5f5$export$de026b00723010c1)("success", "Logged out successfully!");
            // "true" forces reload from server and not just from browseer cache!
            window.setTimeout(()=>{
                location.assign("/");
            }, 1500);
        } else throw new Error(data.message);
    } catch (error) {
        (0, $d538d880fa30d5f5$export$de026b00723010c1)("error", error.message ?? "Error logging out");
    }
};



const $af0faac36f806c5f$export$f558026a994b6051 = async (data, type)=>{
    // when sending formData with fetch(), no contenet-type or JSON.stringify
    const url = type === "password" ? `http://127.0.0.1:8000/api/v1/users/updateMyPassword` : `http://127.0.0.1:8000/api/v1/users/updateMe`;
    const options = {
        method: "PATCH",
        body: data
    };
    try {
        const res = await fetch(url, options);
        // const data = await res.json();
        if (res.ok) (0, $d538d880fa30d5f5$export$de026b00723010c1)("success", `${type.toUpperCase()} updated successfully!`);
        if (!res.ok) throw new Error("There was a problem updating your information.  Try again later!");
    } catch (error) {
        console.log(error);
        (0, $d538d880fa30d5f5$export$de026b00723010c1)("error", error.message);
    }
};



const $d415fe60508c366f$export$8d5bdbf26681c0c2 = async (tourId)=>{
    const stripe = Stripe("pk_test_51MxxFoCyE3KlvgqvKGO9m3AGRmxIkBqFh1nLOX9v8ec1KDNNuL1sdkmQPClFUF0HElHky0vaormgDixvP4MCOVyL00gUtsQ6In");
    try {
        // 1) get session from API
        const res = await fetch(`http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`);
        const session = await res.json();
        // 2) Create checkout form and charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.session.id
        });
    } catch (error) {
        console.log(error);
        (0, $d538d880fa30d5f5$export$de026b00723010c1)("error", err.message);
    }
};


// DOM ELEMENTS
const $a93d8e56e772a055$var$mapBox = document.getElementById("map");
const $a93d8e56e772a055$var$loginForm = document.querySelector(".form--login");
const $a93d8e56e772a055$var$logOutButton = document.querySelector(".nav__el--logout");
const $a93d8e56e772a055$var$userDataForm = document.querySelector(".form-user-data");
const $a93d8e56e772a055$var$userPasswordForm = document.querySelector(".form-user-settings");
const $a93d8e56e772a055$var$bookBtn = document.getElementById("book-tour");
// VALUES
//DELEGATION
if ($a93d8e56e772a055$var$mapBox) {
    const locations = JSON.parse($a93d8e56e772a055$var$mapBox.dataset.locations);
    (0, $ca6382f54d121199$export$4c5dd147b21b9176)(locations);
}
if ($a93d8e56e772a055$var$loginForm) $a93d8e56e772a055$var$loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    (0, $4fc3a66658866aad$export$596d806903d1f59e)(email, password);
});
if ($a93d8e56e772a055$var$logOutButton) $a93d8e56e772a055$var$logOutButton.addEventListener("click", (0, $4fc3a66658866aad$export$a0973bcfe11b05c9));
if ($a93d8e56e772a055$var$userDataForm) $a93d8e56e772a055$var$userDataForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    // to create mulitpart for data
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    // if not using multipart form data, can just pass in object
    // const data = {
    //   name: document.getElementById('name').value,
    //   email: document.getElementById('email').value,
    // };
    (0, $af0faac36f806c5f$export$f558026a994b6051)(form, "data");
});
if ($a93d8e56e772a055$var$userPasswordForm) $a93d8e56e772a055$var$userPasswordForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current");
    const password = document.getElementById("password");
    const passwordConfirm = document.getElementById("password-confirm");
    const data = {
        passwordCurrent: passwordCurrent.value,
        password: password.value,
        passwordConfirm: passwordConfirm.value
    };
    await (0, $af0faac36f806c5f$export$f558026a994b6051)(data, "password");
    document.querySelector(".btn--save-password").textContent = "Save password";
    passwordCurrent.value = "";
    password.value = "";
    passwordConfirm.value = "";
});
if ($a93d8e56e772a055$var$bookBtn) $a93d8e56e772a055$var$bookBtn.addEventListener("click", (e)=>{
    e.target.textContent = "proccessing...";
    const { tourId: tourId  } = e.target.dataset;
    (0, $d415fe60508c366f$export$8d5bdbf26681c0c2)(tourId);
});


//# sourceMappingURL=bundle.js.map
