
// Override action execution
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
