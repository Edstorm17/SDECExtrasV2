
chrome.storage.sync.get(
    { confirmDisconnect: true, leftMenuButton: 'lower' },
    (items) => {
        initMain(items.confirmDisconnect, items.leftMenuButton);
    }
);

function initMain(confirmDisconnect, leftMenuButton) {

    //Replace the header logo with custom one
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

    if (leftMenuButton === 'upper') {
        const lmButton = document.getElementById('lnkMenuGauche');
        document.querySelector(".bandeau-page-haut").insertAdjacentElement("afterbegin", lmButton);
    }

}
