var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

$(document).ready(() => {
    var editMode = { method: '/posts', postID: 0 };

    $.ajax(
        '/posts', {
            method: 'GET',
            dataType: 'json',
            success: jsonArray => {
                // console.log(jsonArray);
                for (i in jsonArray) { /* There's probably a better way to do this  */
                    updateUI(jsonArray[i]);
                }
                $('.edit').click(e => { /* Edit click handler */
                    let editable = $(e.target).parent().siblings('p');
                    editMode.postID = $(editable).attr('id');
                    $('#inputarea').tinymce().setContent($(editable).html());
                    editMode.method = '/post';
                });
                $('#post-count').html(jsonArray.length);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                alert(`There was an error retrieving recent posts: ${errorThrown}`);
            }
        }
    );

    $('#jeetbutton').click(e => {
        e.preventDefault();
        let data = $('#inputarea').tinymce().getContent();
        if (data) {
            $.ajax(
                editMode.method, {
                    method: 'POST',
                    data: { 'username': 'walker-finlay', 'content': data, 'postID': editMode.postID },
                    success: () => {
                        $('#post-count').html(Number($('#post-count').html()) + 1);
                        let toAdd = { content: data, date: new Date(Date.now()), id: Number($('#post-count').html()) };
                        updateUI(toAdd);
                    },
                    error: err => {
                        alert(`There was an error adding your post: ${err}`);
                    }
                }
            );
            // Cleanup
            $('#inputarea').tinymce().setContent('');
            editMode.method = '/posts';
        } else { /* The text area was empty, do nothing */
            editMode.method = '/posts';
            return;
        }
    });
});

function updateUI(toAdd) {
    let post = $('<div>');
    let postContent = $.parseHTML(toAdd.content);
    $(postContent).attr('id', toAdd.id);
    let date = new Date(Date.parse(toAdd.date)).toLocaleString('en-US', options);
    let postInfo = $('<span>').css('color', 'dimgray');
    $(postInfo).append(date).append(' <a href="#" class="edit" style="color: gray">(edit)</a>');
    $(post).append(postContent).append(postInfo);
    $('#latest').prepend(post);
}