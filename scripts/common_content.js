
let theme;

chrome.storage.sync.get(
    { theme: 'light' },
    (items) => {
        theme = items.theme;

        init();
    }
);

function init() {

    // Inject script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = chrome.runtime.getURL("scripts/injected.js");
    script.onload = function () {
        document.dispatchEvent(new CustomEvent('SDECInjected'));
    }
    document.head.appendChild(script);

    loadTheme(theme);
}

function loadTheme() {
    let link = document.createElement("link");
    link.href = chrome.runtime.getURL('themes/theme_' + theme + ".css");
    link.id = "theme";
    link.type = "text/css";
    link.rel = "stylesheet";

    document.head.appendChild(link);
}
