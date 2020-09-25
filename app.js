var express=require('express');
var app=express();
app.set("view engine","ejs");

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


app.get('/',function(req,res){
    res.render("home");
})

app.get('/superuser',function(req,res){
    res.render("form");
})

app.get('/tutorials',function(req,res){
    res.render("tutorials");
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
            res.render("blogs_shown_t1",{blog:result});
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
                    res.render("video",{result1:result1,result2:result2});
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
            res.render("blogs",{blogs:result});
    })
})

app.get("/add_blogs",function(req,res){
    res.render("new_blog");
})

app.post("/add_blogs",function(req,res){
    let blog;
    if(req.body.type=="written"){
    blog={
        type:req.body.type,
        title:req.body.title,
        body:req.body.body,
        piclink:req.body.piclink,
        link:req.body.link,
        likes:0
    }}
    else{
     blog={
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
    console.log("Successfully connected to server at point 4200");
})