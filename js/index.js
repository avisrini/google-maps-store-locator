window.onload = () => {};

let map;
let markers = [];
let infoWindow;

function initMap() {
    let losAngeles = {
        lat: 34.06338,
        lng: -118.35808,
    };
    map = new google.maps.Map(document.getElementById("map"), {
        center: losAngeles,
        zoom: 11,
        mapTypeId: "roadmap",
    });
    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;
}

function searchStores() {
    clearLocations();
    let foundStores = [];
    let zipcode = document.getElementById("zip-code-input").value;
    if (zipcode) {
        stores.map((store) => {
            let postal = store.address.postalCode.substring(0, 5);
            if (postal == zipcode) {
                foundStores.push(store);
            }
        });
    } else {
        foundStores = stores;
    }
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function setOnClickListener() {
    const storeElements = document.querySelectorAll(".store-container");
    for (let [index, storeElement] of storeElements.entries()) {
        storeElement.addEventListener("click", () => {
            google.maps.event.trigger(markers[index], "click");
        });
    }
}

function displayStores(stores) {
    let storesHtml = "";

    stores.map(function (store, index) {
        storesHtml += `<div class="store-container">
        <div class="store-container-background">
            <div class="store-info-container">
                <div class="store-address">
                    <span>${store.addressLines[0]}</span>
                    <span>${store.addressLines[1]}</span>
                </div>
                <div class="store-phone-number">
                    ${store.phoneNumber}
                </div>
            </div>
            <div class="store-number-container">
                <div class="store-number">
                    ${index + 1}
                </div>
            </div>
        </div>
    </div>`;
    });
    document.querySelector(".stores-list").innerHTML = storesHtml;
}

function showStoresMarkers(stores) {
    let bounds = new google.maps.LatLngBounds();
    stores.map(function (store, index) {
        let name = store.name;
        let address = store.addressLines[0];
        let status = store.openStatusText;
        let phoneNumber = store.phoneNumber;
        let latlng = new google.maps.LatLng(
            parseFloat(store.coordinates.latitude),
            parseFloat(store.coordinates.longitude)
        );

        createMarker(latlng, name, status, address, phoneNumber, index + 1);
        bounds.extend(latlng);
    });
    map.fitBounds(bounds);
}

function createMarker(latlng, name, status, address, phoneNumber, index) {
    let html = `
        <div class="store-info-window">
            <div class="store-info-name"> ${name}
            </div>
            <div class="store-info-status"> ${status}
            </div>
            <div class="store-info-address"> 
                <div class="circle">
                    <i class="fas fa-location-arrow"></i> 
                </div>
                ${address}
            </div>
            <div class="store-info-phone"> 
                <div class="circle">
                    <i class="fas fa-phone"></i>
                </div> 
                ${phoneNumber} 
            </div>
        </div>
    `;
    let marker = new google.maps.Marker({
        map: map,
        position: latlng,
        label: index.toString(),
    });
    google.maps.event.addListener(marker, "click", function () {
        infoWindow.setContent(html);
        infoWindow.open(map, marker);
    });
    markers.push(marker);
}
