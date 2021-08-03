//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose= require("mongoose");

const homeStartingContent ="This is a blog website that lets you post about any topic you wnat to talk about where other people can view and read them so please keep the blogs clean and enjoy blogging";

const aboutContent=" Sed ultrices lectus eget congue ultricies. Donec ut nisl sed lectus pharetra dictum. Pellentesque eget eros at quam porttitor fringilla. Integer gravida consectetur ipsum vitae molestie. Morbi porttitor felis et augue luctus, in finibus urna tempus. Donec at congue justo. Integer sodales massa congue urna ornare viverra. Nulla a augue risus.";

const contactContent ="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et dignissim mauris, at dapibus sem. Vestibulum justo nibh, malesuada sit amet mauris at, euismod sodales tellus. Nulla facilisi. Morbi vulputate metus massa, quis molestie urna maximus vitae. Sed at tincidunt erat. Aenean finibus consequat elementum. In elementum eros eu cursus dictum. Vivamus malesuada justo dolor, vitae faucibus libero tincidunt in. Proin aliquam metus id felis imperdiet porta. Duis nec lobortis diam, iaculis mollis lectus.";

const app =  express();

mongoose.connect("mongodb://localhost:27017/blogDB",{useNewUrlParser:true,useUnifiedTopology:true});

const BlogSchema = new mongoose.Schema({
  title: String,
  post: String
});

const Blog = mongoose.model("Blog",BlogSchema);



app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine","ejs");
let posts =[];

app.get("/",function(req,res){
  Blog.find(function(err,foundList){
    res.render("index",{text: homeStartingContent,posts: foundList});
  });


});
app.get("/about",function(req,res){
  res.render("about",{aboutus:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contact: contactContent});
});
app.get("/compose",function(req,res){
  res.render("compose");

});



app.post("/compose",function(req,res){
  let composeTitle = (req.body.publish);
  let composeBody = req.body.postText;

  const post = {
    title: composeTitle,
    textArea: composeBody
  };
  let newCompose = _.lowerCase(composeTitle);
  const blog = new Blog({title: newCompose,post: composeBody});
  blog.save();
  posts.push(post);
  res.redirect("/");


});
app.get("/posts/:topic",function(req,res){
  var requested = req.params.topic;
  var lowered = _.lowerCase(requested);
  console.log(lowered);

  Blog.findOne({title:lowered},function(err,foundList){
    if(!foundList){
      console.log("not found");
    }
    else{
      res.render("post",{title: foundList.title,body: foundList.post});
      console.log("match found");
    }
  });

  // for(var i=0;i<posts.length;i++){
  //   let match= posts[i].title;
  //   let content = posts[i].textArea;
  //
  //   if(_.lowerCase(match)=== _.lowerCase(requested)){
  //     console.log("match found");
  //
  //     res.render("post",{title: match,body:content });
  //   }
  //     else
  //     {
  //       console.log("not found");
  //
  //     }
  //
  // }





});


app.listen(3000, function(){
  console.log("server started");
});
