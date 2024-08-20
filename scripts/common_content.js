
let theme;

chrome.storage.sync.get(
    { theme: 'light' },
    (items) => {
        theme = items.theme;

        init();
    }
);

function init() {

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
