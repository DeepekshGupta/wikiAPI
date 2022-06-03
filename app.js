// jshint esversion:6

const express = require("express");
// const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(express .urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Mongoose connect:
// mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewURLParser: true});
const db_url =  "mongodb+srv://"+ process.env.USER_NAME +"@cluster0.krgkwhr.mongodb.net/wikiDB";
mongoose.connect(db_url, {useNewURLParser: true});


const articleSchema = {
    title : String,
    content : String
};

const Article = mongoose.model("Article", articleSchema);

app.get("/", function(req, res){
  res.send("The Wikipedia API")
})

app.route("/articles")
    .get(function(req, res){
        Article.find(function(err, foundArticles){
            if(!err){
                res.send(foundArticles)
            }
            else{
                res.send(err)
            }
        })
    })

    .post(function(req, res){
        // console.log(req.body.title);
        // console.log(req.body.content);
        console.log(req.body);

        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content
        });
    
        newArticle.save(function(err){
            if(!err){
                res.send("Succesfully added Data");
            }
            else{
                res.send(err);
            }
        });
    })

    .delete(function(req, res){
        Article.deleteMany(function(err){
            if(!err){
                res.send("Succesfully Deleted Data");
            }
            else{
                res.send(err);
            }
        });
    });




app.route("/articles/:articleTitle")

.get(function(req, res){
  const articleTitle = req.params.articleTitle;
  Article.findOne({title: articleTitle}, function(err, article){
    if (article){
    //   const jsonArticle = JSON.stringify(article);
    //   res.send(jsonArticle);
      res.send(article);

    } else {
      res.send("No article with that title found.");
    }
  });
})


.put(function(req, res){

    const articleTitle = req.params.articleTitle;

    // const query = { name: 'borne' };
    Article.findOneAndUpdate(
        {title: articleTitle},
        {title : req.body.title,content : req.body.content},
        // null,
        {overwrite: true},
        function(err){
            if (!err){
              res.send("Successfully updated the content of the selected article.");
            } else {
              res.send(err);
            }
          });

    })

    
    .patch(function(req, res){

        const articleTitle = req.params.articleTitle;
    
        // const query = { name: 'borne' };
        Article.findOneAndUpdate(
            {title: articleTitle},
            {$set : req.body},
            // null,
            // {overwrite: true},
            function(err){
                if (!err){
                  res.send("Successfully Patched updated the content of the selected article.");
                } else {
                  res.send(err);
                }
              });
    
        })
    
    .delete(function(req, res){
        const articleTitle = req.params.articleTitle;
        Article.findOneAndDelete({title: articleTitle}, function(err){
            if (!err){
            res.send("Successfully deleted " + articleTitle + " article.");
            } else {
            res.send(err);
            }
        });
        });



//TODO

app.listen(process.env.PORT || 3000, () => console.log("server is running on port 3000"))

