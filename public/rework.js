/**
 * Frontend rework using plain old js
 */

var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
var postCount = 0;
var edit = { method: 'POST', postID: '0' };

/**
 * Helper method for adding a new post to the top of the recent list
 * Called by adding new post and loading all posts
 * @param {JSON} add 
 */
function displayPost(add) {
    let postDiv = document.createElement('div');
    let innerDiv = document.createElement('div');
    innerDiv.id = `p${add.id}`;
    innerDiv.innerHTML = add.content;
    postDiv.appendChild(innerDiv);

    let date = new Date(Date.parse(add.date)).toLocaleString('en-US', options);
    let postInfo = document.createElement('span');

    // Create edit button DOM node and attach event handler
    let editbtn = document.createElement('a');
    editbtn.href = '#';
    editbtn.style.color = 'gray';
    editbtn.addEventListener('click', e => {
        editPost(e);
    });
    editbtn.innerHTML = '(edit)';
    postInfo.innerHTML = `${date} `;
    postInfo.appendChild(editbtn);

    postInfo.style.color = 'dimgray';
    postDiv.appendChild(postInfo);
    document.querySelector('#latest').prepend(postDiv);

    postCount++;
}

// Display recent posts -------------------------
ajax('GET', '/posts')
    .then(jsonArray => {
        // console.log(jsonArray);
        for (i in jsonArray) {
            displayPost(jsonArray[i]);
        }
        document.querySelector('#post-count').innerHTML = postCount;
    })
    .catch(err => { alert(`Error retrieving recent posts! ${err}`) });

// Submit a post --------------------------------
document.querySelector('#jeetbutton')
    .addEventListener('click', event => {
        event.preventDefault();
        let myContent = tinymce.activeEditor.getContent();
        let newPost = { username: 'walker-finlay', content: myContent, postID: edit.postID.substr(1) };
        if (myContent) { /* Send it to the server */
            ajax(edit.method, '/posts', newPost)
                .then(res => {
                    console.log(res);
                    tinymce.activeEditor.setContent('');
                    if (edit.method == 'POST') {
                        displayPost({ id: res, content: myContent, date: new Date(Date.now()) });
                    } else {
                        document.querySelector(`#${edit.postID}`).innerHTML = myContent;
                        console.log(document.querySelector(`#${edit.postID}`));
                    }
                    let reset = document.querySelector('.cancel');
                    if (reset) {
                        reset.className = 'edit';
                        reset.style.color = 'gray';
                        reset.innerHTML = '(edit)';
                    }
                    edit.method = 'POST';
                    document.querySelector('#post-count').innerHTML = postCount;
                })
                .catch(err => { alert(`Error adding post ${err}`) });
        } else { /* Text area is empty, do nothing */
            return;
        }
    });

// Edit a post ----------------------------------
function editPost(event) { /* This is messy */
    edit.method = 'PUT';
    let cancels = document.querySelector('.cancel');
    if (cancels) {
        cancels.className = 'edit';
        cancels.style.color = 'gray';
        cancels.innerHTML = '(edit)';
        if (cancels == event.target) tinymce.activeEditor.setContent('');
    }

    event.target.className = 'cancel';
    event.target.innerHTML = '(cancel)';
    event.target.style.color = 'red';
    let current = event.target.parentElement.parentElement.cloneNode(true);
    current.removeChild(current.lastChild);
    tinymce.activeEditor.setContent(current.innerHTML);
    edit.postID = event.target.parentElement.previousSibling.id;

    if (cancels == event.target) {
        cancels.className = 'edit';
        cancels.style.color = 'gray';
        cancels.innerHTML = '(edit)';
        tinymce.activeEditor.setContent('');
        edit.method = 'POST';
    }
}