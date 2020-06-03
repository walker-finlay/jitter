/**
 * Frontend rework using plain old js
 */

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
var domparser = new DOMParser();

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
                    reject("Server error");
                }
            }
        }

        // Send it ------------------------------
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    });
}

function toggleEditMode(event) {
    console.log(event);
}

// Display recent posts -------------------------
ajax('GET', '/posts')
    .then(jsonArray => {
        // console.log(jsonArray);
        for (i in jsonArray) {
            let postDiv = document.createElement('div');
            postDiv.id = `p${jsonArray[i].id}`;
            postDiv.innerHTML = jsonArray[i].content;

            let date = new Date(Date.parse(jsonArray[i].date)).toLocaleString('en-US', options);
            let postInfo = document.createElement('span');
            postInfo.innerHTML =
                `${date} <a href="#" onclick="toggleEditMode()" class="edit" style="color: gray">(edit)</a>`;
            postInfo.style.color = 'dimgray';
            postDiv.appendChild(postInfo);
            document.querySelector('#latest').prepend(postDiv);
        }
    })
    .catch(err => { alert(err) });

// Submit/edit a post ---------------------------
document.querySelector('#jeetbutton')
    .addEventListener('click', event => {
        let myContent = tinymce.activeEditor.getContent();
        console.log(myContent);
        tinymce.activeEditor.setContent('');
    });





// let data = { username: 'walker-finlay', content: 'my message 2' };
// ajax('POST', '/posts', data)
//     .catch(err => { alert(err) });