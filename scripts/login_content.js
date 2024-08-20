
chrome.storage.sync.get(
    { theme: 'light', hideLoginLogo: false, cleanLogin: false, compactCommuniques: false },
    (items) => {
        initLogin(items.theme, items.hideLoginLogo, items.cleanLogin, items.compactCommuniques);
    }
);

function initLogin(theme, hideLoginLogo, cleanLogin, compactCommuniques) {

    // Login logo
    const logo = document.querySelector(".login-logoLogin");

    logo.src = chrome.runtime.getURL('images/login_logo_' + theme + '.png');
    document.querySelector(".login-logoEntete").src = chrome.runtime.getURL('images/header_logo_' + theme + '.png');

    if (hideLoginLogo) {
        logo.style.display = "none";
    }

    // Cleanup login page
    if (cleanLogin) {
        const loginLeft = document.querySelector(".login-gauche");
        loginLeft.style.display = "none";
    }

    // Compact communiques
    if (compactCommuniques) {

        // First contents
        const firstSep = document.querySelector(".pagecoba > .rangee:has(> div > .login-sep)");
        const firstContents = [];
        let current;
        for (current = firstSep.nextElementSibling; current && current.firstElementChild.nodeName.toLowerCase() !== "div"; current = current.nextElementSibling) {
            firstContents.push(current);
        }

        // Second contents
        const secondContents = [];
        for (current = current.nextElementSibling; current && current.firstElementChild.nodeName.toLowerCase() !== "div"; current = current.nextElementSibling) {
            secondContents.push(current);
        }

        // Assemble page
        const lastSep = current;
        const mainContainer = document.createElement("div");
        const leftContainer = document.createElement("div");
        const rightContainer = document.createElement("div");
        mainContainer.classList.add("communiquesContainer");
        for (const element in firstContents) {
            leftContainer.appendChild(firstContents[element]);
        }
        for (const element in secondContents) {
            rightContainer.appendChild(secondContents[element]);
        }
        mainContainer.appendChild(leftContainer);
        mainContainer.appendChild(rightContainer);
        firstSep.insertAdjacentElement("afterend", mainContainer);
        lastSep.style.display = "none";
    }

}
