var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
var editMode = { method: '/posts', postID: 0 };

/**
 * Taken from an old school project
 * @param {string} reqType 
 * @param {string} url 
 * @param {boolean} async 
 */
function httpRequest(reqType, url, async, body) {
    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else if (window.ActiveXObject) { /* IE */
        request = new ActiveXObject("Msxml2.XMLHTTP");
        if (!request) {
            request = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    if (request) {
        initReq(reqType, url, async, body);
    } else {
        alert("Your browser doesn't support any features?");
    }
}

function initReq(reqType, url, bool, body) {
    request.onreadystatechange = handleResponse; /* Handle response asynchronously */

    request.open(reqType, url, bool);
    if (reqType == 'POST') {
        request.setRequestHeader('Content-Type', 'application/json');
    }

    request.send({ 0: 'a' });
}

function handleResponse() {
    if (request.readyState == 4) {
        if (request.status == 200) {
            let data = JSON.parse(request.responseText);
            console.log(data);
        } else {
            alert("A problem occurred communicating with the server");
        }
    }
}

// Load up recent posts
var recentPosts = 'loaded';
document.getElementById('latest').innerHTML = recentPosts;
httpRequest('GET', '/posts', true);


// Attach submit event handler
let jeetbutton = document.getElementById('jeetbutton');
jeetbutton.addEventListener('click', event => {
    event.preventDefault();
    // let postContent = tinymce.get('inputarea').getContent();
    let postContent = 'content';
    httpRequest('POST', '/posts', true, postContent);
});