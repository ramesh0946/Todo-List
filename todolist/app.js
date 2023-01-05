const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set("view engine", "ejs");

//connection to the mongoose

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser: true});

//creating schema

const itemsSchema = {
  name: String
}

//creating model

const Item = mongoose.model("Item", itemsSchema);


//creating default documents using Item model

const item1 = new Item({
  name : "Welcome to your todolist!"
});

const item2 = new Item({
  name : "Hit the + button to add a new item."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

// created an array to store above three documents

const defaultItems = [item1, item2, item3];



// first we created a get request which consist of find() 

app.get("/", function (req, res) {

//Find() consist of 2 parameters = err and founditems(which is just a variable that is used to check the collection in the mongoose)

Item.find({},function(err, foundItems){

  // if foundItems length is 0, then it will run the insertMany() to insert the default items
  if(foundItems.length === 0 ){
    Item.insertMany(defaultItems, function(err){
      if(err){
    
        console.log(err);
      }else{
        console.log("successfully inserted default items!!");
      }
    });
    res.redirect("/");
  }else{

    //else it will render the list.ejs file

    res.render("list", { listTitle: "Today", newListItems : foundItems });
  }
});

});

// this post request is used to add new items to the list
app.post("/", function(req,res){
    let itemName = req.body.newItem;

    const item = new Item({
      name : itemName
    });

    item.save();
    res.redirect("/");
});

// this post request is used to delete the selected items from the list
app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;

  // it use a findByIdAndRemove() of mongoose contains 2 parameters (checkedItemId , function()) - both are necessory
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("successfully removed the checked item!!");
      res.redirect("/");
    }
  });


});


app.listen(3000, function () {
  console.log("server is running on port 3000");
});
