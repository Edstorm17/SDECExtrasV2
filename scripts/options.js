
let link = document.createElement("link");
link.href = chrome.runtime.getURL("/styles.css");
link.type = "text/css";
link.rel = "stylesheet";

document.head.appendChild(link);

const status = document.getElementById("status");

const saveOptions = () => {
    const theme = document.getElementById("theme").value;
    const logo = document.getElementById("hideLoginLogo").checked;
    const cleanLogin = document.getElementById("cleanLogin").checked;
    const compactCommuniques = document.getElementById("compactCommuniques").checked;
    const leftMenuButton = document.getElementById("leftMenuButton").value;
    const hideUseless = document.getElementById("hideUselessTabs").checked;
    const games = document.getElementById("games").checked;
    const confirmDisconnect = document.getElementById("confirmDisconnect").checked;

    chrome.storage.sync.set(
        {
            theme: theme,
            hideLoginLogo: logo,
            cleanLogin: cleanLogin,
            compactCommuniques: compactCommuniques,
            leftMenuButton: leftMenuButton,
            hideUselessTabs: hideUseless,
            games: games,
            confirmDisconnect: confirmDisconnect,
        },
        () => {
            status.textContent = 'Options sauvegardées.';
            setTimeout(() => status.textContent = '', 3000);
        }
    );
};

const restoreOptions = () => {
    chrome.storage.sync.get(
        {
            theme: 'light',
            hideLoginLogo: false,
            cleanLogin: false,
            compactCommuniques: false,
            leftMenuButton: 'lower',
            hideUselessTabs: false,
            games: false,
            confirmDisconnect: true,
        },
        loadOptions
    );
};

function loadOptions(items) {
    document.getElementById("theme").value = items.theme;
    document.getElementById("hideLoginLogo").checked = items.hideLoginLogo;
    document.getElementById("cleanLogin").checked = items.cleanLogin;
    document.getElementById("compactCommuniques").checked = items.compactCommuniques;
    document.getElementById("leftMenuButton").value = items.leftMenuButton;
    document.getElementById("hideUselessTabs").checked = items.hideUselessTabs;
    document.getElementById("games").checked = items.games;
    document.getElementById("confirmDisconnect").checked = items.confirmDisconnect;
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
    chrome.storage.sync.get(
        {
            theme: 'light',
            hideLoginLogo: false,
            cleanLogin: false,
            compactCommuniques: false,
            leftMenuButton: 'lower',
            hideUselessTabs: false,
            games: false,
            confirmDisconnect: true,
        },
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
            console.log(err);
            status.textContent = 'Le contenu du presse-papiers est invalide.';
            setTimeout(() => status.textContent = '', 3000);
            return false;
        }

        chrome.storage.sync.set(json, () => {
            loadOptions(json);
            status.textContent = 'Options chargées à partir du presse-papiers.';
            setTimeout(() => status.textContent = '', 3000);
        });
    });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);

document.getElementById("appearanceButton").addEventListener("click", (e) => openTab(e, 'appearance'));
document.getElementById("interfaceButton").addEventListener("click", (e) => openTab(e, 'interface'));
document.getElementById("qolButton").addEventListener("click", (e) => openTab(e, 'qol'));
document.getElementById("exportButton").addEventListener("click", (e) => openTab(e, 'export'));

document.getElementById("copyExportButton").addEventListener("click", copyExport);
document.getElementById("pasteImportButton").addEventListener("click", pasteImport);

document.getElementById("appearanceButton").click();
