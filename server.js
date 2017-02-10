var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var config = {
    user:'krithiskkv',
    database: 'krithiskkv',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
    //password: 'Keshav1$'
};

var pool = new Pool(config);

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'RandomSecret',
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }
}));

//fuction to create individual pages by injecting data specific to the pages into a template

function createTemplate (data) {

    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    var count = 0;
    var bgimage = data.bgimage;
    var cmntcnt = data.cmntcnt;
    var authorname = data.authorname;
    
    var htmlTemplate = `<!DOCTYPE html>
                            <html>
                            <title>${title}</title>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1">
                            <link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css">
                            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
                            <link rel="stylesheet" href="http://www.w3schools.com/lib/w3-theme-black.css">
                            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
                            <link rel="stylesheet" href="/ui/style.css">
                            <style>
                            body,h1,h2,h3,h4,h5 {font-family: "Raleway", sans-serif}
                            </style>
                            <ul id="nav-bar" class="w3-navbar w3-theme-d2 w3-center">
                              <li> <a href="/" class="w3-teal"> <i class="fa fa-home"></i> Back to Home</a> </li>
                            </ul>
                            <body class="w3-light-grey">

                            <div class="w3-content" style="max-width:1400px">

                            <header class="w3-container w3-center w3-padding-32"> 
                              <h1><b>MY BLOG</b></h1>
                              <p>Welcome to my blog</p>
                            </header>

                            <div class="w3-row">

                            <div class="w3-col l8 s12">
                              <!-- Blog entry -->
                              <div class="w3-card-4 w3-margin w3-white">
                                <img src=${bgimage} alt="bgimage" style="width:100%">
                                <div class="w3-container w3-padding-8">
                                  <h3><b>${heading}</b></h3>
                                  <h5>by ${authorname}, <span class="w3-opacity">${date.toDateString()}</span></h5>
                                </div>

                                <div class="w3-container">
                                   ${content} 
                                  <div class="w3-row">
                                    <div class="w3-col m8 s12">
                                      <p><button id="cmntlink" class="w3-btn w3-teal w3-padding-large w3-border w3-hover-border-black"> <i class="fa fa-comments"><b>Comments</b></i><span class="w3-tag">  ${cmntcnt}</span></button>
                                      <button id="counter" class="w3-btn w3-teal w3-padding-large w3-border w3-hover-border-black"><b>Like</b> <i class="fa fa-thumbs-up"></i> </button> <span id="count">   </span> <span> Likes </span> 
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr>
                            </div>
                           
                                          <!-- Introduction menu -->
                            <div class="w3-col l4">
                              <!-- About Card -->
                              <div class="w3-card-2 w3-margin w3-margin-top">
                              <img src="/ui/prof.png" style="width:100%">
                                <div class="w3-container w3-white">
                                  <h4><b>Krithika S</b></h4>
                                  <p>Web developer, former mainframe techie, avid reader, foodie, traveler.</p>
                                </div>
                              </div><hr>                              
                              <!-- Posts -->
                              <div class="w3-card-2 w3-margin">
                                <div class="w3-container w3-padding">
                                  <h4>Popular Posts</h4>
                                </div>
                                <ul class="w3-ul w3-hoverable w3-white">
                                  <li class="w3-padding-16">
                                    <img src="/w3images/workshop.jpg" alt="Image" class="w3-left w3-margin-right" style="width:50px">
                                    <span class="w3-large">Lorem</span><br>
                                    <span>Sed mattis nunc</span>
                                  </li>      
                                </ul>
                              </div>
                              <hr> 
                              <!-- END Introduction Menu -->
                            <div class="w3-container">  
                              <a href="#top"> Go To Top </a>
                              <br>
                              <h3> Comments </h3>
                              <p id="cmntInput"></p>
                              <ul id="commlist" style="height:250; overflow:auto; list-style-type: none;"> </ul>
                            </div>
                            </div>
                            <!-- END GRID -->
                            </div><br>
                            <!-- END w3-content -->
                            </div>
                            <!-- Footer -->
                            <footer class="w3-container w3-dark-grey w3-padding-32 w3-margin-top">
                              <button class="w3-btn w3-disabled w3-padding-large w3-margin-bottom">Previous</button>
                              <button class="w3-btn w3-padding-large w3-margin-bottom">Next »</button>
                              <div class="w3-center"
                              <h4>Follow Me</h4>
                              </br>
                              <a class="w3-btn-floating w3-teal" href="https://twitter.com/intent/tweet?screen_name=krithiskkv" title="Twitter"><i class="fa fa-twitter"></i></a>
                              <a class="w3-btn-floating w3-teal" href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=krithiskkv@gmail.com&body=Hi Krithika" title="Mail"><i class="fa fa-envelope"></i></a>
                              <a class="w3-btn-floating w3-teal w3-hide-small" href="https://in.linkedin.com/pub/krithika-subramanian/131/a95/821" title="Linkedin"><i class="fa fa-linkedin"></i></a>
                              <a class="w3-btn-floating w3-teal" href="https://github.com/krithiskkv" title="Github"><i class="fa fa-github"></i></a>
                              <p>Powered by <a href="http://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a></p>
                              </div>
                            </footer>
                            <script type="text/javascript" src="/ui/articles.js"> </script>
                            </body>
                            </html>`;
        return htmlTemplate;
}

function hash(input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ["pbkdf2", "10000", salt,  hashed.toString('hex')].join('$');
}


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

//page for posting new article 
app.get('/post-article', function (req, res) {
    res.sendFile(path.join(__dirname,'ui', 'postarticle.html'));
});

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname,'ui', 'login.html'));
});

app.get('/hash/:input', function(req, res) {
    var hashedString = hash(req.params.input, 'random-string' );
    res.send(hashedString); 
});

app.post('/create-user', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password, salt);
    if (username.trim().length > 0 && password.trim().length > 0) {
        pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function(err, result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
             res.send('User successfully created' + username); }
    });
    } else {
            res.staus(403).send('Username/password cannot be blank');        
    }
});

app.post('/login', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username.trim().length > 0 && password.trim().length > 0) {
    pool.query('SELECT * FROM "user" WHERE username = $1', [username], function(err, result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
            if (result.rows.length === 0) {
                res.status(403).send('Username/passsword is invalid!');
            }
            else {
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPwd = hash(password, salt);
                
                if (hashedPwd === dbString)
                   { req.session.auth = {userId: result.rows[0].id};
                     res.send(result.rows[0].username); }
                else
                    { res.status(403).send('Username/passsword is invalid!');}
            }    
        }
    });
    } else {
        res.status(403).send('Username/password cannot be blank');
    }
});

app.get('/check-login', function(req, res) {
   if (req.session && req.session.auth && req.session.auth.userId ) {
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err,result) {
           if (err) {
               res.status(500).send('An error occured');
           }
           else {
               res.send(result.rows[0].username);
           }
       });
   }
   else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function(req,res) {
    delete req.session.auth;
    //res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/prof.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'prof.png'));
});

app.get('/ui/like.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'like.png'));
});


app.get('/ui/Gmail.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Gmail.png'));
});

app.get('/ui/linkedin.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'linkedin.png'));
});

app.get('/ui/github.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'github.png'));
});

app.get('/ui/comments.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'comments.png'));
});

app.get('/ui/office.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'office.jpg'));
});


app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/js/index.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'js', 'index.js'));
});

app.get('/ui/post.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'post.js'));
});

app.get('/ui/articles.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'articles.js'));
});

app.get('/ui/background-2.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'background-2.jpg'));
});
 

app.get('/ui/office.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'office.jpg'));
});

app.get('/ui/books1.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'books1.jpg'));
});

app.get('/ui/mainframe.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'mainframe.png'));
});

app.get('/ui/dining1.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'dining1.jpg'));
});

app.get('/ui/ocjp6.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'ocjp6.png'));
});

app.get('/ui/defaultimg.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'defaultimg.png'));
});

app.get('/ui/submit.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'submit.png'));
});

app.get('/ui/resort.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'resort.png'));
});

app.get('/ui/imad.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'imad.png'));
});

app.get('/ui/schema.docx', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'schema.docx'));
});

app.get('/ui/architecture.pptx', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'architecture.pptx'));
});
// /initcounter/articleName obtains the current Likes counter for an article 

var counter = 0;
app.get('/initcounter/:articleName', function(req, res) {
    pool.query("SELECT likecount FROM article WHERE articlename = $1" , [req.params.articleName], function(err,result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
             if (result.rows.length === 0) {
                res.status(404).send('Article not found'); }
             else {
                  counter = result.rows[0].likecount;
                  res.send(result.rows[0].likecount.toString()); }
              }
     });
});

// /counter increments the Likes counter for an article by 1
app.get('/counter/:articleName', function(req, res) {
    counter = counter + 1;
    pool.query("UPDATE article SET likecount = $2 WHERE articlename = $1", [req.params.articleName, counter], function(err,result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
             res.send(counter.toString()); }
        });
});

// /initcmnt obtains the current list of comments for a page from the comment table

var commentsData = [];
app.get('/initcmnt/:articleName', function(req, res) {
    commentsData = [];
    pool.query("SELECT b.comment, b.user_name, b.date, a.cmntcnt FROM article AS a, comment AS b WHERE articlename = $1 AND article_id = id ORDER BY b.date DESC, b.time DESC", [req.params.articleName], function(err, result) {
        if (err) {
            console.log(err);          
            res.status(500).send(err.toString()); }
        else { 
            if (result.rows.length === 0) {
                res.status(404).send('Article not found'); }
            else {
                var cmntlist = [];
                for (var i=0; i < result.rows.length; i++) {
                    commentsData.push(result.rows[i]); 
                }
                res.send(JSON.stringify(commentsData));
            }        
        }
    });
});

// /submit-cmnt adds the new comment into the comment list and comment table

var date = new Date();
var yyyy = date.getFullYear().toString();
var mm = (date.getMonth()+1).toString();
var dd  = date.getDate().toString();

var mmChars = mm.split('');
var ddChars = dd.split('');

var formatdate= yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);

var time = (("0" + date.getHours()).slice(-2)   + ":" + 
            ("0" + date.getMinutes()).slice(-2) + ":" + 
            ("0" + date.getSeconds()).slice(-2));
var datestring = formatdate.toString();
var timestring = time.toString();

app.post('/submit-cmnt/:articleName', function(req, res) {
    var comment = req.body.comment; 
    var username = req.body.username;
    
    var updtcmntcnt = 0;
    
    pool.query("SELECT id , cmntcnt FROM article WHERE articlename = $1" , [req.params.articleName], function(err,result) {
        if (err) {
           res.status(500).send(err.toString()); }
        else {
            if (result.rows.length === 0) {
                res.status(404).send('Article not found'); }
            else {
                var articleid = result.rows[0].id;
                updtcmntcnt   = result.rows[0].cmntcnt + 1;
                pool.query("UPDATE article SET cmntcnt = $2 WHERE id = $1" , [articleid, updtcmntcnt], function(err,result) {
                    if (err) {
                       res.status(500).send(err.toString()); }
                    else {
                            pool.query("INSERT INTO comment (article_id, comment, date, time, user_name) VALUES ($1, $2, $3, $4, $5)", [articleid, comment, datestring, timestring, username], function(err,result) {
                                if (err) { 
                                    res.status(500).send(err.toString());  }
                                else { 
                                    var commentData = {'comment' : comment, 'user_name': username, 'date': datestring, 'cmntcnt': updtcmntcnt};
                                    commentsData.unshift(commentData);
                                    res.send(JSON.stringify(commentsData)); }
                            });
                    }
                });
            } 
        }
    });
});

//get the list of all articles in a particular category
app.get('/get-articles/:category', function (req, res) {
      pool.query("SELECT * FROM article WHERE category=$1 AND aprv_ind IS TRUE ORDER BY date DESC", [req.params.category], function(err,result) {
        if (err) {
           res.status(500).send(err.toString());
        } else {
             if (result.rows.length === 0) {
                res.status(404).send('Article category not found');
            } else {
                    res.send(JSON.stringify(result.rows));
            }
        }
     }); 
});

//insert new article data into database
app.post('/submit-article', function (req, res) {
    if (req.body.imglink.trim() === '') {req.body.imglink = '/ui/defaultimg.png';}  
    pool.query("INSERT INTO article (title, content, author_id, authorname, category, articlename, heading, date, bgimage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [req.body.title, req.body.content, req.session.auth.userId, req.body.authorname, req.body.category, req.body.shortname, req.body.heading, datestring, req.body.imglink], function(err,result) {
            if (err) {
               res.status(500).send(err.toString());
            } else 
            {
                res.send('Article data recorded successfully and will be posted after approval');
            }
    }); 
});

//select data needed to build the page requested from the database and render it using the createTemplate function
app.get('/articles/:articleName', function (req, res) {
      pool.query("SELECT * FROM article WHERE articlename=$1", [req.params.articleName], function(err,result) {
        if (err) {
           res.status(500).send(err.toString());
        } else {
             if (result.rows.length === 0) {
                res.status(404).send('Article not found');
            } else {
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
     }); 
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
