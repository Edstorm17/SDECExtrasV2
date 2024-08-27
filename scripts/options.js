
const defaultJSON = {
    theme: 'light',
    hideLoginLogo: false,
    cleanLogin: false,
    hideImage: false,
    compactCommuniques: false,
    leftMenuButton: 'lower',
    hideUselessTabs: false,
    games: false,
    confirmDisconnect: true,
    autoLogin: false
}

const allJSON = defaultJSON;
allJSON["loginUser"] = '';
allJSON["loginPassword"] = '';


let link = document.createElement("link");
link.href = chrome.runtime.getURL("/styles.css");
link.type = "text/css";
link.rel = "stylesheet";

document.head.appendChild(link);

const status = document.getElementById("status");

const saveOptions = () => {
    const options = document.querySelectorAll(".option");
    const json = allJSON;

    options.forEach(option => {
        json[option.id] = (option.nodeName.toLowerCase() === "input" && option.type === "checkbox") ? option.checked : option.value;
    });
    console.log(json);

    chrome.storage.sync.set(
        json,
        () => {
            status.textContent = 'Options sauvegardées.';
            setTimeout(() => status.textContent = '', 3000);
        }
    );
};

const restoreOptions = () => {
    chrome.storage.sync.get(
        defaultJSON,
        loadOptions
    );
};

function loadOptions(items) {
    for (const key in items) {
        const value = items[key];
        if (typeof value === "boolean") {
            document.getElementById(key).checked = value;
        } else {
            document.getElementById(key).value = value;
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
    chrome.storage.sync.get(
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
