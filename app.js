var express=require('express');
var app=express();
app.set("view engine","ejs");
app.use(express.static("public"));

var bodyParser =require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'iwp project trial'
});
db.connect();

var useris='';


// =============================
//        Authentication
// =============================


app.get('/signup',function(req,res){
    res.render("signup",{user:useris});
})

app.post("/signup",function(req,res){
    var u=req.body.username;
    var user={
        username:req.body.username,
        password:req.body.password,
        email:req.body.email,
    }
    let sql="INSERT INTO users SET ?";
    db.query(sql,user,function(err){
        if(err)
            throw err;
        else{
            res.redirect("/");
        }
    })
})

app.get("/signin",function(req,res){
    res.render("signin",{user:useris});
})

app.post("/signin",function(req,res){
    let sql="SELECT * FROM users WHERE username = \""+req.body.username+"\" and password = \""+req.body.password+"\"";
    console.log(sql);
    db.query(sql,function(err,result){
        console.log(result);
        if(err)
        throw err;
        else{
            result.forEach((row)=>{
                useris=row.username;
                app.use(function(req,res,next){
                    res.locals.useris=useris;
                    console.log(res.locals);
                    next();
                })
                res.redirect("/superuser");
            })
        }
    })
})

app.get("/signout",function(req,res){
    useris='';
    res.redirect("/");
})
// ===========================

app.get('/',function(req,res){
    res.render("home",{user:useris});
})

app.get('/superuser',function(req,res){
    res.render("form",{user:useris});
})

app.get('/tutorials',function(req,res){
    res.render("tutorials",{user:useris});
})

app.post('/superuser',function(req,res){
    let info;
    if(req.body.id==0){
        info={
            title:req.body.title,
            likes:req.body.likes,
            embedded:req.body.link,
            section:req.body.section
        };    
    }
    else{
        info={
            id:req.body.id,
            title:req.body.title,
            likes:req.body.likes,
            embedded:req.body.link,
            section:req.body.section
        };
    }
    let sql="INSERT INTO tutorials SET ?";
    db.query(sql,info,function(err){
        if(err)
            throw err;
        res.redirect('/superuser');
    })
})


app.get("/blogs/:id",function(req,res){
    let blog="SELECT * FROM blogs WHERE id="+req.params.id;
    db.query(blog,function(err,result){
        if(err)
            throw err;
        else
            res.render("blogs_shown_t1",{blog:result,user:useris});
    })
})

app.get("/blogs/:id/like",function(req,res){
    let blog="SELECT * FROM blogs WHERE id="+req.params.id;
    db.query(blog,function(err,result){
        if(err)
        throw err;
        else{
            Object.keys(result).forEach(function(key){
                var blg=result[key];
                var like=Number(blg.likes)+1;
                let sql2="UPDATE blogs SET likes="+like+" WHERE id="+req.params.id;
                db.query(sql2);
            })
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

app.get('/:_section/:_embedded',function(req,res){
    let sql1="SELECT * FROM tutorials WHERE section=\""+req.params._section+"\" ORDER BY id ASC";
    let sql2="SELECT * FROM tutorials WHERE section=\""+req.params._section+"\" and embedded=\""+req.params._embedded+"\"";
    db.query(sql1,function(err1,result1){
        if(err1)
            throw err1;
        else{
            db.query(sql2,function(err2,result2){
                if(err2)
                    throw err2;
                else{
                    res.render("video",{result1:result1,result2:result2,user:useris});
                }
            })
        }
    })
})

app.get("/blogs",function(req,res){
    let sql="SELECT * FROM blogs";
    db.query(sql,function(err,result){
        if(err)
            throw err;
        else
            res.render("blogs",{blogs:result,user:useris});
    })
})

app.get("/add_blogs",function(req,res){
    res.render("new_blog",{user:useris});
})

app.post("/add_blogs",function(req,res){
    let blog;
    if(req.body.type=="written"){
    blog={
        author:req.body.author,
        type:req.body.type,
        innerhtml:req.body.innerhtml,
        title:req.body.title,
        body:req.body.body,
        piclink:req.body.piclink,
        link:req.body.link,
        likes:0
    }}
    else{
     blog={
        author:req.body.author,
        type:req.body.type,
        title:req.body.title,
        link:req.body.link,
        body:req.body.body,
        likes:0
     }
    }
    let sql="INSERT INTO blogs SET ?";
    db.query(sql,blog,function(err){
        if(err)
            throw err;
        else{
            res.redirect("/add_blogs");
        }
    })
})

app.listen(4200,process.env.IP,function(req,res){
    console.log("See the majic on port 4200");
})