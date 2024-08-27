
// Override action execution
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

// Auto login
document.addEventListener('SDECLogin', function(e) {
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
