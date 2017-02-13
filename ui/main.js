//as soon as the home page is loaded check to see if the user is logged in and build login/logout area accodingly
checkLogin();
loadPersArticles();
loadProfArticles();

function buildpost() {
    var post_btn = document.getElementById('post_btn');
    post_btn.innerHTML = '<a href="/post-article">Post Article</a>';
}

function checkLogin() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                buildLogout(this.responseText);
                buildpost();
                }
            else {
                buildLogin();                
            }
        }
    };
    request.open('GET', '/check-login', true);
    request.send(null);
}

function loadPersArticles() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('PersList');
            if (request.status === 200) {
                var content = '';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    var articleName = escapeHTML(articleData[i].articlename);
                    content += `<a href="/articles/${articleName}" class="w3-btn w3-teal w3-medium">${articleName}</a>`;
                }
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!');
            }
        }
};
    
    request.open('GET', '/get-articles/Personal', true);
    request.send(null);
}

function loadProfArticles() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('ProfList');
            if (request.status === 200) {
                //var content = '<ul>';
                var content = '';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                //    content += `<li>
                content += `<a href="/articles/${articleData[i].articlename}" class="w3-btn w3-teal w3-medium">${articleData[i].articlename}</a>`;
                //    (${articleData[i].date.split('T')[0]})`;
                }
                //content += "</ul>";
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!');
            }
        }
};
    
    request.open('GET', '/get-articles/Professional', true);
    request.send(null);
}

//build login/registration form
function buildLogin() {
    var loginbtn = document.getElementById('loginbtn');
    loginbtn.innerHTML = 'Login/Sign-up';
    var loginarea = document.getElementById('loginarea');
    loginarea.innerHTML = `<button onclick="document.getElementById('id01').style.display='block'" class="w3-btn w3-teal w3-medium">Login</button>
                           <button onclick="document.getElementById('id02').style.display='block'" class="w3-btn w3-teal w3-medium">Sign-up</button>`;
    var button2 = document.getElementById('Login');
    button2.onclick = function () {
        button2.innerHTML = 'Signing in..';
        var request = new XMLHttpRequest();
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        if (username.trim().length > 0 && password.trim().length > 0) {
            request.onreadystatechange = function() {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        document.getElementById('id01').style.display='none';
                        alert('Login successful');
                        buildLogout(username);
                        buildpost();
                        if (window.location.pathname.split('/')[1] === 'articles'){
                            buildsubcmnt();
                        } 
                    }
                    else if (request.status === 403) {
                            alert('Username/password does not exist');
                            document.getElementById('username').value = '';
                            document.getElementById('password').value = '';
                    }
                    else if (request.status === 500) {
                        alert('An error occured');
                        document.getElementById('username').value = '';
                        document.getElementById('password').value = '';
                    }
                    button2.innerHTML = 'Sign-in';
                }
            };
            request.open('POST', '/login', true);
            request.setRequestHeader('Content-Type','application/json');
            request.send(JSON.stringify({username : username, password: password}));
        }
        else {
            alert('Username/password cannot be blank');
            button2.innerHTML = 'Sign-in';
        }
    };

    var button3 = document.getElementById('Register');
    button3.onclick = function () {
        button3.innerHTML = 'Registering..';
        var request = new XMLHttpRequest();
        var username = document.getElementById('newusername').value;
        var password = document.getElementById('newpassword').value;
        if (username.trim().length > 0 && password.trim().length > 0) {
            request.onreadystatechange = function() {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        document.getElementById('id02').style.display='none';
                        alert('User ' + username + ' created successfully. You can now login.');
                    }
                    else if (request.status === 500) {
                        alert('An error occured');
                        document.getElementById('newusername').value = '';
                        document.getElementById('newpassword').value = '';
                    }
                button3.innerHTML = 'Register';
                }
            };
            request.open('POST', '/create-user', true);
            request.setRequestHeader('Content-Type','application/json');
            request.send(JSON.stringify({username : username, password: password}));
        }
        else {
            alert('Username/password cannot be blank');
            button3.innerHTML = 'Register'
        }
    };
}

function buildsubcmnt() {
    var cmntarea = `
                    Write a comment...
                    <br/>
                    <textarea rows="2" cols="50" class="scrollabletextbox" id="comment" name="comments" ></textarea>
                    <br/>
                <input type="submit" id="submit_btn" value="Submit"> </input>`;
    document.getElementById('cmntInput').innerHTML = cmntarea;
    document.getElementById('comment').addEventListener("keyup",function(event) {
        if (event.keyCode == 13 ) {
        event.preventDefault();
        document.getElementById('submit_btn').click();
        }
    });
    //on clicking Submit button, add the text in the comment box to the database and display the updated comments list 
    var submit = document.getElementById('submit_btn');
    submit.onclick = function() {
        var commInput = document.getElementById('comment');
        var comment = commInput.value;
        if (comment > " ") {
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    var commentsData = JSON.parse(this.responseText);
                    var list = '';
                    for (var i=0;i<commentsData.length;i++) {
                      list += '<li class="comment">' + escapeHTML(commentsData[i].comment)  + '<small>' + '-- ' + escapeHTML(commentsData[i].user_name) + ' ' + commentsData[i].date.split('T')[0] + '</small>' + '</li>' + '<br/>';
                    }
                    var ul = document.getElementById('commlist');
                    ul.innerHTML = list;
                    var cmntlink = document.getElementById('cmntlink');
                    var cmntstring = commentsData[0].cmntcnt + ' comments';
                    cmntlink.innerHTML = cmntstring;
                    }
                } 
            };
            request.open('POST', '/submit-cmnt/' + articleName, true);
            request.setRequestHeader('Content-Type','application/json');
            request.send(JSON.stringify({comment : comment, username : username}));
            document.getElementById('comment').value="";
        }
    };
}

function escapeHTML (text)
{
    var $text = document.createTextNode(text);
    var $div = document.createElement('div');
    $div.appendChild($text);
    return $div.innerHTML;
}

function buildLogout(username) { 
    var loginbtn = document.getElementById('loginbtn');
    loginbtn.innerHTML = 'Hi, ' + escapeHTML(username) + '<small>▼</small>';
    var loginarea = document.getElementById('loginarea');
    loginarea.innerHTML = '<a href="/logout" class="w3-btn w3-teal w3-medium"> Logout <i class="fa fa-sign-out" aria-hidden="true"></i> </a>';
}




