/**
 * Generalized ajax request.
 * Returns a promise, resolving on server response, rejecting on error
 * @param {string} method REST
 * @param {string} url 
 * @param {JSON} data optional - only used for PUT and POST
 */
function ajax(method, url, data) {
    return new Promise((resolve, reject) => {
        // Browser compatibility ----------------
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) { /* MS */
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
            if (!xhr) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        if (!xhr) reject("What browser are you using?");

        // bind readystatechange handler --------
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    let responseData =
                        xhr.responseText ?
                        JSON.parse(xhr.responseText) : '';
                    resolve(responseData);
                } else {
                    reject(xhr.responseText);
                }
            }
        }

        // Send it ------------------------------
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    });
}