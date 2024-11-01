const actionJSON = {
    "action": 7, // Custom, see /scripts/injected.js
    "url": browser.runtime.getURL("pages/options.html")
}

const optionsJSON = {
    "n": "lnkMenu",
    "l": "Paramètres SDEC Extras",
    "p": encodeURIComponent(JSON.stringify(actionJSON)),
    "i": ""
}

const HOME_STR = "ACCUEIL";
const RESULTS_STR = "RÉSULTATS";
const EMAILS_STR = "COURRIELS"

browser.storage.sync.get(
    {
        theme: 'light',
        hideImage: false,
        hideEmailIcons: false,
        confirmDisconnect: true,
        leftMenuButton: 'lower',
        hideWelcomeWidget: false,
        hideGeneralInfoWidget: false,
        hideUselessTabs: false,
        uselessTabsToHide: [],
        games: false,
        colorUnreadEmails: false,
        unreadEmailColor: '#ff0000'
    },
    initMain
);

function initMain(options) {

    document.addEventListener('SCXDocumentLoad', () => onPageLoad(options));

    // Add options button to options-link popup
    const optionsAnchor = document.querySelector('.lien-avec-options');
    if (optionsAnchor) {
        let data = optionsAnchor.getAttribute('data-option');
        const json = JSON.parse(decodeURIComponent(data));
        const arr = json["options"];
        arr.unshift(optionsJSON);

        // Also confirm disconnect
        if (!options.confirmDisconnect) {
            arr[arr.length - 1].p = JSON.parse(decodeURIComponent(JSON.parse(decodeURIComponent(arr[arr.length - 1].p)).config)).boutons[0].action;
        }

        json["options"] = arr;
        data = encodeURIComponent(JSON.stringify(json));
        optionsAnchor.setAttribute('data-option', data);
    }

    // Add SDEC Extras Options button to tabs
    const parent = document.querySelector(".treeview__sousmenu > li:last-child > .treeview__sousmenu");
    if (parent) {
        const optionsButton = parent.firstElementChild.cloneNode(true);
        optionsButton.querySelector("i").innerHTML = "settings";
        const optionsAnchor = optionsButton.querySelector("a");
        optionsAnchor.innerHTML = "Paramètres SDEC Extras";
        optionsAnchor.setAttribute("data-action", encodeURIComponent(JSON.stringify(actionJSON)));

        // Add games
        if (options.games) {
            const flappyButton = optionsButton.cloneNode(true);
            const flappyIcon = flappyButton.querySelector("i");
            flappyIcon.innerHTML = "flutter_dash";
            const flappyAnchor = flappyButton.querySelector("a");
            flappyAnchor.innerHTML = "Flappy"
            flappyAnchor.removeAttribute("data-togglemenu");
            flappyAnchor.removeAttribute("data-ripple");
            flappyAnchor.removeAttribute("data-action");
            flappyAnchor.href = "#main-content";
            flappyAnchor.addEventListener('click', initFlappy);

            parent.appendChild(flappyButton);
        }

        parent.appendChild(optionsButton);
    }

    // Replace the header logo with custom one
    {
        const newLogo = document.createElement("img");
        newLogo.src = browser.runtime.getURL("images/header_logo_" + theme + ".png");
        newLogo.classList.add("headerLogo");
        const headerLogo = document.getElementById("logo2");
        if (headerLogo) {
            headerLogo.insertAdjacentElement("afterend", newLogo);
        }
        const headerLogo2 = document.getElementById("logo_2");
        if (headerLogo2) {
            headerLogo2.insertAdjacentElement("afterend", newLogo);
        }
    }

    // Disconnect
    if (!options.confirmDisconnect) {
        const dcButton = document.getElementById('lnkDecEnt');
        if (dcButton) {
            let action = dcButton.getAttribute('data-action');
            action = JSON.parse(decodeURIComponent(JSON.parse(decodeURIComponent(action)).config)).boutons[0].action;
            dcButton.setAttribute('data-action', action);
        }
    }

    // Left menu button position
    if (options.leftMenuButton === 'upper') {
        const lmButton = document.getElementById('lnkMenuGauche');
        if (lmButton) {
            document.querySelector(".bandeau-page-haut").insertAdjacentElement("afterbegin", lmButton);
        }
    }

    // Hide user image
    if (options.hideImage) {
        const img = document.getElementById('image-user');
        if (img) {
            img.style.display = "none";
            document.querySelector('#image-user ~ br')?.remove();
        }
    }

    // Hide "useless" tabs
    if (options.hideUselessTabs) {
        const items = document.querySelectorAll(".treeview__sousmenu .treeview__sousmenu .treeview__item");
        items.forEach(item => {
            const anchor = item.querySelector("a");
            if (options.uselessTabsToHide.includes((anchor.textContent || anchor.innerText).toUpperCase())) {
                item.style.display = "none";
            }
        });
    }

    onPageLoad(options);
}

function onPageLoad(options) {
    const titleElement = document.getElementById("bandeau-titre-service");
    if (!titleElement) return;
    const title = (titleElement.textContent || titleElement.innerText).toUpperCase();

    if (title === HOME_STR) { // Home page

        // Hide widgets
        const widgets = document.querySelectorAll(".plaquette");
        if (options.hideWelcomeWidget) {
            const welcomeWidget = widgets[0];
            if (welcomeWidget) {
                const title = welcomeWidget.querySelector("h4");
                if (title && (title.innerText || title.textContent) === "BIENVENUE !") {
                    // We got the right widget

                    welcomeWidget.style.display = "none";
                }
            }
        }
        if (options.hideGeneralInfoWidget) {
            const generalInfoWidget = widgets[2];
            if (generalInfoWidget) {
                const title = generalInfoWidget.querySelector("h4");
                if (title && (title.innerText || title.textContent) === "INFORMATION GÉNÉRALE") {
                    // We got the right widget

                    generalInfoWidget.style.display = "none";
                }
            }
        }

    } else if (title === EMAILS_STR) { // Emails page

        // Color unread emails
        if (options.colorUnreadEmails) {
            const emails = document.querySelectorAll("#lnk1_GrilleCourriels.grid3 .grid3__row");
            for (let i = 0; i < emails.length; i++) {
                const emailRow = emails[i];
                const checkContainer = emailRow.querySelector(".chkSelection");
                if (!checkContainer) {
                    emailRow.firstElementChild.style.backgroundColor = options.unreadEmailColor;
                }
            }
        }

        // Hide email icons
        if (options.hideEmailIcons) {
            document.querySelectorAll(".icone-lettre").forEach(icon => {
                icon.style.display = "none";
            });
            document.querySelectorAll(".check").forEach(check => {
                check.style.margin = "10px";
            });
        }

    }
}

function initFlappy(event) {
    event.preventDefault();

    let principal = document.getElementById("main-content");
    document.getElementById("bandeau-titre-service").innerText = "Flappy";
    principal.innerHTML = '';
    principal.style.height = "100%";

    let frame = document.createElement("iframe");
    frame.src = browser.runtime.getURL("pages/flappy.html");
    frame.width = "100%";
    frame.height = "100%";
    frame.style.border = "none";

    principal.appendChild(frame);
}
