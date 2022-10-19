//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

mongoose.connect("mongodb+srv://Deepak_611:Abc%4061122@cluster0.xkerui0.mongodb.net/ToDoDb",{useNewUrlParser:true});
 
postPage=''

const ToDolistSchema = {
  name: {
    type: String,
    required: true,
  },
};

const listSchema={
  name:String,
  items:[ToDolistSchema]
}

const AnotherToDoItems=mongoose.model('AnotherToDo',listSchema)

const TodoItems = mongoose.model("Todo", ToDolistSchema);

const todoitem1 = new TodoItems({
  name: "Click on + icon to Add items.",
});


const defaultItems = [todoitem1];



const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const day = date.getDate();
app.get("/", function (req, res) {
 TodoItems.find({}, (err, items) => {
  if(items.length===0){
     TodoItems.insertMany(defaultItems,(err)=>{
            console.log(err)
        })
  }
      res.render("list", { listTitle: day, newListItems: items });
    
  });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;
  const list = req.body.list;
 console.log(list)
    if(item!==''){
      const getitem= new TodoItems({
        name:item  
    })
if(list===day){
   getitem.save();
   res.redirect("/");
  }
  else{
    AnotherToDoItems.findOne({name:list},(err,result)=>{
      if(!err){
        
        result.items.push(getitem)
        result.save();
        res.redirect("/"+list);
      }
    })
   }
    }
  
});
app.post("/postPage", function (req, res) {
  const item = req.body.newItem;

 
    if(item!==''){
    const getitem= new AnotherToDoItems({
      name:postPage,
      items:defaultItems
  })
   getitem.save();
   
    }
    res.redirect("/postPage");
  
});


app.get('/:postname',(req,res)=>{
   postPage=req.params.postname
   postPage=postPage.charAt(0).toUpperCase() + postPage.slice(1)
   AnotherToDoItems.findOne({name:postPage},(err,result)=>{
    if(!result){
     
      const getitem= new AnotherToDoItems({
       name:postPage,
       items:defaultItems
      })
      getitem.save()   
      res.render('list',{listTitle:postPage,newListItems:getitem.items})
    }
    else{
      res.render('list',{listTitle:postPage,newListItems:result.items})

   }
})


      

})



app.post("/delete", function (req, res) {
  const itemId = req.body.checkbox;
  const listName = req.body.list;
  if(listName===day){
 
  TodoItems.deleteOne({_id :itemId},(err)=>{
        console.log(err)
        })
        res.redirect("/");
}
   else{
   AnotherToDoItems.findOneAndUpdate({name:listName},{$pull:{items:{_id:itemId}}},function(err,result){
if(!err){
  res.redirect("/"+listName)
}
   })
   }

  }
);




app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(process.env.PORT ||3000, function () {
  console.log("Server started on port 3000");
});
