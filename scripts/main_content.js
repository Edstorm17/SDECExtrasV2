const optionsJSON = {
    "n": "lnkMenu",
    "l": "Options SDEC Extras",
    "p": encodeURIComponent(JSON.stringify({
        "action": 7, // Custom, see /scripts/injected.js
        "url": chrome.runtime.getURL("pages/options.html")
    })),
    "i": ""
}

const COURRIELS_STR = "COURRIELS"

chrome.storage.sync.get(
    { theme: 'light', confirmDisconnect: true, leftMenuButton: 'lower', hideImage: false, colorUnreadEmails: false, unreadEmailColor: '#ff0000' },
    (items) => {
        initMain(items.theme, items.confirmDisconnect, items.leftMenuButton, items.hideImage, items.colorUnreadEmails, items.unreadEmailColor);
    }
);

function initMain(theme, confirmDisconnect, leftMenuButton, hideImage, colorUnreadEmails, unreadEmailColor) {

    document.addEventListener('SDECDocumentLoad', () => onPageLoad(colorUnreadEmails, unreadEmailColor));

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

function onPageLoad(colorUnreadEmails, unreadEmailColor) {
    const title = document.getElementById("bandeau-titre-service");

    // Color unread emails
    if (title && title.innerText === COURRIELS_STR && colorUnreadEmails) {
        const emails = document.querySelectorAll(".grid3__row");
        for (let i = 0; i < emails.length; i++) {
            const emailRow = emails[i];
            const checkContainer = emailRow.querySelector(".chkSelection");
            if (!checkContainer) {
                emailRow.firstElementChild.style.backgroundColor = unreadEmailColor;
            }
        }
    }
}
