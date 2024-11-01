
let clickEvent = 'touchstart' in window ? 'touchstart' : 'click';
clickEvent = 'click';

const defaultJSON = {
    theme: 'light',
    hideLoginLogo: false,
    cleanLogin: false,
    hideImage: false,
    hideEmailIcons: false,
    compactCommuniques: false,
    leftMenuButton: 'lower',
    hideWelcomeWidget: false,
    hideGeneralInfoWidget: false,
    hideUselessTabs: false,
    uselessTabsToHide: [
        "DOCUMENTS",
        "NOTES PERSONNELLES",
        "DOCUMENTS OFFICIELS",
        "DOCUMENTS PUBLICS"
    ],
    games: false,
    colorUnreadEmails: false,
    unreadEmailColor: '#ff0000',
    confirmDisconnect: true,
    autoLogin: false
}

const nonSavedJSON = {
    loginUser: '',
    loginPassword: ''
}

const allJSON = JSON.parse(JSON.stringify(defaultJSON));
allJSON["nonSaved"] = nonSavedJSON;

const status = document.getElementById("status");

const saveOptions = () => {
    const options = document.querySelectorAll(".option");
    const json = allJSON;

    options.forEach(option => {
        let value;
        if (option.nodeName.toLowerCase() === "input" && option.type === "checkbox") {
            value = option.checked;
        } else if (option.nodeName.toLowerCase() === "select" && option.hasAttribute("multiple")) {
            value = Array.from(option.options).filter(o => o.selected).map(o => o.value);
        } else {
            value = option.value;
        }
        if (option.classList.contains('nonSaved')) {
            json["nonSaved"][option.id] = value;
        } else {
            json[option.id] = value;
        }
    });
    
    browser.storage.sync.set(
        json,
        () => {
            status.textContent = 'Options sauvegardées.';
            setTimeout(() => status.textContent = '', 3000);
        }
    );
};

const restoreOptions = () => {
    browser.storage.sync.get(
        allJSON,
        loadOptions
    );
};

function loadOptions(items) {
    for (let key in items) {
        const value = items[key];
        if (value.constructor === Object) loadOptions(value);
        const element = document.getElementById(key);
        if (!element) continue;
        if (typeof value === "boolean") {
            element.checked = value;
        } else if (Array.isArray(value)) {
            const opts = element.options;

            for (let i = 0; i < opts.length; i++) {
                opts[i].selected = value.includes(opts[i].value)
            }
            element.options = opts;
        } else {
            element.value = value;
        }
    }
}

function openTab(evt, tab) {
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("TabContent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("TabLinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className += " active";
}

function copyExport() {
    browser.storage.sync.get(
        defaultJSON,
        (items) => {
            navigator.clipboard.writeText(btoa(JSON.stringify(items))).then(() => {
                    status.textContent = 'Options copiées au presse-papiers.';
                    setTimeout(() => status.textContent = '', 3000);
            });
        }
    );
}

function pasteImport() {
    let json;
    navigator.clipboard.readText().then(text => {
        try {
            json = JSON.parse(atob(text));
        } catch (err) {
            status.textContent = 'Le contenu du presse-papiers est invalide.';
            setTimeout(() => status.textContent = '', 3000);
            return false;
        }

        browser.storage.sync.set(json, () => {
            loadOptions(json);
            status.textContent = 'Options chargées à partir du presse-papiers.';
            setTimeout(() => status.textContent = '', 3000);
        });
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener(clickEvent, saveOptions);

document.getElementById("appearanceButton").addEventListener(clickEvent, (e) => openTab(e, 'appearance'));
document.getElementById("interfaceButton").addEventListener(clickEvent, (e) => openTab(e, 'interface'));
document.getElementById("qolButton").addEventListener(clickEvent, (e) => openTab(e, 'qol'));
document.getElementById("exportButton").addEventListener(clickEvent, (e) => openTab(e, 'export'));

document.getElementById("copyExportButton").addEventListener(clickEvent, copyExport);
document.getElementById("pasteImportButton").addEventListener(clickEvent, pasteImport);

document.getElementById("appearanceButton").click();
