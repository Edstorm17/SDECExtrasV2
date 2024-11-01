
browser.storage.sync.get({
        theme: 'light',
        hideLoginLogo: false,
        cleanLogin: false,
        compactCommuniques: false,
        autoLogin: false,
        nonSaved: {
            loginUser: '',
            loginPassword: ''
        }
    },
    initLogin
);

let loginInitiated = false;
function initLogin(items) {
    if (loginInitiated) return;
    loginInitiated = true;
    
    const logo = document.querySelector(".login-logoLogin");

    // Call auto login
    if (logo && items.autoLogin) {
        document.addEventListener('SCXInjected', () => document.dispatchEvent(new CustomEvent('SCXLogin', {
            detail: {
                user: items.nonSaved.loginUser,
                password: items.nonSaved.loginPassword
            }
        })));
    }

    // Login logo
    if (logo) {
        logo.src = browser.runtime.getURL('images/login_logo_' + items.theme + '.png');

        document.querySelector(".login-logoEntete").src = browser.runtime.getURL('images/header_logo_' + items.theme + '.png');

        if (items.hideLoginLogo) {
            logo.style.display = "none";
        }
    }

    // Options button
    const forgotPasswordBtn = document.querySelector(".bouton-plat.neutre");
    if (forgotPasswordBtn) {
        const optionsBtn = document.createElement("input");
        optionsBtn.type = "image";
        optionsBtn.classList.add("optionsButton");
        optionsBtn.src = browser.runtime.getURL('images/options_' + items.theme + '.svg');
        optionsBtn.addEventListener('click', () => {
            window.open(browser.runtime.getURL('pages/options.html')).focus();
        });
        forgotPasswordBtn.insertAdjacentElement("beforebegin", optionsBtn);
    }

    // Cleanup login page
    if (items.cleanLogin) {
        const loginLeft = document.querySelector(".login-gauche");
        loginLeft.style.display = "none";
    }

    // Compact communiques
    if (items.compactCommuniques) {

        // First contents
        const firstSep = document.querySelector(".pagecoba > .rangee:has(> div > .login-sep)");
        if (firstSep) {
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

}
