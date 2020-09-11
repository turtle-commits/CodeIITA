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
    let info={
        title:req.body.title,
        likes:req.body.likes,
        link:req.body.link,
        section:req.body.section
    };
    let sql="INSERT INTO tutorials SET ?";
    db.query(sql,info,function(err){
        if(err)
            throw err;
        res.redirect('/superuser');
    })
})

app.get('/:_section/:_id',function(req,res){
    let sql1="SELECT * FROM tutorials WHERE section=\""+req.params._section+"\"";
    let sql2="SELECT * FROM tutorials WHERE section=\""+req.params._section+"\" and id=\""+req.params._id+"\"";
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


app.listen(4200,process.env.IP,function(req,res){
    console.log("Successfully connected to server");
})