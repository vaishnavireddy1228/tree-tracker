/* ---------------- LOGIN CHECK ---------------- */
if (sessionStorage.getItem("treeTrackerLoggedIn") !== "true") {
    window.location.href = "login.html";
}

/* DISPLAY USERNAME */
let user = sessionStorage.getItem("treeTrackerUser");
document.getElementById("welcomeUser").innerText = "Welcome, " + user + "!";

/* ---------------- LOAD + SAVE TREES ---------------- */
function loadTrees() {
    return JSON.parse(localStorage.getItem("trees")) || [];
}

function saveTrees(trees) {
    localStorage.setItem("trees", JSON.stringify(trees));
}

/* ---------------- AUTO GPS LOCATION ---------------- */
function getLocation() {
    if (!navigator.geolocation) {
        alert("Your device does not support GPS.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            document.getElementById("lat").value = position.coords.latitude.toFixed(6);
            document.getElementById("lon").value = position.coords.longitude.toFixed(6);
            alert("Exact location detected ✔");
        },

        (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                alert(
                    "Please allow location permission.\n\n" +
                    "Steps if blocked:\n1. Tap the lock icon\n2. Go to Permissions\n3. Enable Location"
                );
            } else {
                alert("Unable to detect GPS location.");
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

/* ---------------- ADD TREE ---------------- */
function addTree() {
    let name = document.getElementById("treeName").value.trim();
    let loc = document.getElementById("location").value.trim();
    let dateVal = document.getElementById("date").value.trim();
    let imgFile = document.getElementById("image").files[0];

    let lat = document.getElementById("lat").value.trim();
    let lon = document.getElementById("lon").value.trim();

    if (!name || !loc || !dateVal || !imgFile) {
        alert("Fill all details + upload a photo!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (e) {
        let trees = loadTrees();
        trees.push({
            name: name,
            location: loc,
            date: dateVal,
            image: e.target.result,
            lat: lat,
            lon: lon
        });

        saveTrees(trees);
        showTrees();
    };

    reader.readAsDataURL(imgFile);
}

/* ---------------- SHOW TREES ---------------- */
function showTrees() {
    let trees = loadTrees();
    let list = document.getElementById("treeList");
    list.innerHTML = "";

    /* Dashboard */
    document.getElementById("totalTrees").innerText = trees.length;

    let month = new Date().getMonth() + 1;
    document.getElementById("monthTrees").innerText =
        trees.filter(t => Number(t.date.split("-")[1]) === month).length;

    trees.forEach((t, i) => {
        let mapBtn =
            t.lat && t.lon
                ? `<a class="map-btn" href="https://www.google.com/maps?q=${t.lat},${t.lon}" target="_blank">Exact Location</a>`
                : `<a class="map-btn" href="https://www.google.com/maps/search/${t.location}" target="_blank">Open in Maps</a>`;

        list.innerHTML += `
        <div class="card">
            <img src="${t.image}" class="tree-img">

            <h3>${t.name}</h3>
            <p><b>Location:</b> ${t.location}</p>
            <p><b>Date:</b> ${t.date}</p>

            ${t.lat ? `<p><b>Lat:</b> ${t.lat}</p>` : ""}
            ${t.lon ? `<p><b>Lon:</b> ${t.lon}</p>` : ""}

            <button class="edit-btn" onclick="editTree(${i})">Edit</button>
            <button class="delete-btn" onclick="deleteTree(${i})">Delete</button>

            ${mapBtn}
        </div>`;
    });
}

/* ---------------- DELETE TREE ---------------- */
function deleteTree(i) {
    let trees = loadTrees();
    trees.splice(i, 1);
    saveTrees(trees);
    showTrees();
}

/* ---------------- EDIT TREE ---------------- */
function editTree(i) {
    let trees = loadTrees();
    let t = trees[i];

    let nn = prompt("New name:", t.name);
    let nl = prompt("New location:", t.location);
    let nd = prompt("New date:", t.date);

    let newLat = prompt("New Latitude:", t.lat || "");
    let newLon = prompt("New Longitude:", t.lon || "");

    if (nn && nl && nd) {
        t.name = nn;
        t.location = nl;
        t.date = nd;
        t.lat = newLat;
        t.lon = newLon;

        saveTrees(trees);
        showTrees();
    }
}

/* ---------------- LOGOUT ---------------- */
function logout() {
    sessionStorage.clear();
    window.location.href = "login.html";
}

/* ---------------- INIT ---------------- */
showTrees();
