
// Override action execution function
if (executerAction) {
    const executerActionOriginal = executerAction;
    executerAction = function(n, t, i) {
        switch(t.action) {
            case 7: // Add open in new tab
                window.open(t.url, '_blank').focus();
                break;
            default:
                executerActionOriginal(n, t, i);
        }
    }
}

// Override document load function
if (onDocumentLoad) {
    const onDocumentLoadOriginal = onDocumentLoad;
    onDocumentLoad = function () {
        onDocumentLoadOriginal();
        document.dispatchEvent(new CustomEvent('SCXDocumentLoad'));
    }
}

// Override left menu toggle function
/*
if (toggleMenuGauche) {
    const toggleMenuGaucheOriginal = toggleMenuGauche;
    toggleMenuGauche = function () {
        const menu = document.getElementById("menugauche"),
            shadow = document.getElementById("ombre");

        if (menu.classList.contains("left-sidebar--cache")) {
            if (menu.classList.contains("left-sidebar--float")) {
                shadow.style.display = "block";
                setTimeout(() => {
                    shadow.style.opacity = "0.5";
                }, 0);
            }
            menu.classList.remove("left-sidebar--cache");
            ajusterHauteurMenuGauche();
        } else {
            if (menu.classList.contains("left-sidebar--float")) {
                shadow.style.opacity = "0";
                shadow.addEventListener(transitionEndEventName(), onEndOmbre, false);
                menu.style.top = "0px";
            } else {
                menu.style.top = "85px"
                ajusterHauteurMenuGauche();
                menu.classList.add("left-sidebar--cache");
                menu.classList.remove("left-sidebar--float");
            }
        }
        dispatchResize();
    }
}
*/


// Auto login
document.addEventListener('SCXLogin', function(e) {
    const page = document.querySelector("div.pagecoba");
    const button = document.getElementById(page.id + '_btnConnecter');
    const url = JSON.parse(decodeURIComponent(button.getAttribute('data-action')))["param"];
    const cpss = document.getElementById(page.id + '__cpss');

    const formData = new FormData;
    formData.append(page.id + '_txtCodeUsager', e.detail.user);
    formData.append(page.id + '_txtMotDePasse', e.detail.password);
    formData.append(page.id + '__cpss', cpss.value);
    formData.append('__postcomponent', page.id + '_btnConnecter');
    formData.append('__id', page.id);

    postData(url, formData, function(response, success, info) {
        let header = info.getResponseHeader("content-type");
        if (header.indexOf("json") > -1) {
            traiterReponseJSON(response);
            button.disabled = false;
        } else {
            page.outerHTML = url;
        }
        mettreFocusSurElementEnErreur();
        onDocumentLoad()
    });
});

// Results Editing
if (CobaJS) {
    CobaJS.Register("SDX_EditResults", function () {
        document.dispatchEvent(new CustomEvent('SCXEditResults'));
    });
}
