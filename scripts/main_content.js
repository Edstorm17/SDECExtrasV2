const optionsJSON = {
    "n": "lnkMenu",
    "l": "Options SDEC Extras",
    "p": encodeURIComponent(JSON.stringify({
        "action": 7, // Custom, see /scripts/injected.js
        "url": chrome.runtime.getURL("pages/options.html")
    })),
    "i": ""
}

chrome.storage.sync.get(
    { theme: 'light', confirmDisconnect: true, leftMenuButton: 'lower', hideImage: false },
    (items) => {
        initMain(items.theme, items.confirmDisconnect, items.leftMenuButton, items.hideImage);
    }
);

function initMain(theme, confirmDisconnect, leftMenuButton, hideImage) {

    // Add options button to options-link popup
    const optionsAnchor = document.querySelector('.lien-avec-options');
    if (optionsAnchor) {
        let data = optionsAnchor.getAttribute('data-option');
        const json = JSON.parse(decodeURIComponent(data));
        const arr = json["options"];
        arr.unshift(optionsJSON);

        // Also confirm disconnect
        if (!confirmDisconnect) {
            arr[arr.length - 1].p = JSON.parse(decodeURIComponent(JSON.parse(decodeURIComponent(arr[arr.length - 1].p)).config)).boutons[0].action;
        }

        json["options"] = arr;
        data = encodeURIComponent(JSON.stringify(json));
        optionsAnchor.setAttribute('data-option', data);
    }

    // Replace the header logo with custom one
    const headerLogo2 = document.getElementById("logo2");
    if (headerLogo2) {
        const newLogo = document.createElement("img");
        newLogo.src = chrome.runtime.getURL("images/header_logo_" + theme + ".png");
        newLogo.classList.add("headerLogo");

        headerLogo2.insertAdjacentElement("afterend", newLogo);
    }

    // Disconnect
    if (!confirmDisconnect) {
        const dcButton = document.getElementById('lnkDecEnt');
        if (dcButton) {
            let action = dcButton.getAttribute('data-action');
            action = JSON.parse(decodeURIComponent(JSON.parse(decodeURIComponent(action)).config)).boutons[0].action;
            dcButton.setAttribute('data-action', action);
        }
    }

    // Left menu button position
    if (leftMenuButton === 'upper') {
        const lmButton = document.getElementById('lnkMenuGauche');
        document.querySelector(".bandeau-page-haut").insertAdjacentElement("afterbegin", lmButton);
    }

    // Hide user image
    if (hideImage) {
        const img = document.getElementById('image-user');
        if (img) {
            img.style.display = "none";
            document.querySelector('#image-user ~ br')?.remove();
        }
    }

}
