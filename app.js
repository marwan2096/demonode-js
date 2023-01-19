const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const bodyParserForm = bodyParser.urlencoded();
const { application } = require("express");
const port = 8081;
//auto refresh


const app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))


let setti= {
    IdCounter:1
}
let contacts = []

app.set("view engine","ejs");

app.get("/home",function(req,res){
    let user = "Ahmed";

    let users = ["Ahmed","Ali","Nader"]
    res.render("home.ejs",{Name:user,Users:users})
})


//display all contacts
app.get("/allcontacts",function(req,res){

    let fcontacts = contacts;
    if(req.query.q){
        fcontacts = contacts.filter(contact=> contact.Name.indexOf(req.query.q)>-1 || contact.author.indexOf(req.query.q)>-1)
    }
    
    res.render("allcontacts.ejs",{q:req.query.q,fcontacts});

})


//add new contact
app.get("/addcontact",function(req,res){
    res.render("addcontact.ejs");
})

app.post("/addcontact",bodyParserForm,function(req,res){
    req.body.Id = setti.IdCounter++;
    contacts.push(req.body)
    saveDataToFile();
    res.render("redirect.ejs");
})

//update contact

app.get("/updatecontact",function(req,res){

    let contact = contacts.find(contact=>contact.Id== req.query.Id);
    res.render("updatecontact.ejs",{contact});
});


app.post("/updatecontact",bodyParserForm,function(req,res){
    //console.log(req.body);

    //find item that match the id in the array
    let contact = contacts.find(contact=>contact.Id==req.body.Id);
    
    //update item with new values
    contact.Name=req.body.Name;
    contact.author=req.body.author;

    saveDataToFile();
    res.render("redirect.ejs");
})

//delete contact
app.get("/deletecontact",function(req,res){
    //console.log(req.body);

    //find item that match the id in the array
    let contactIndex = contacts.findIndex(contact=>contact.Id==req.query.Id);
    contacts.splice(contactIndex,1);
    saveDataToFile();
    res.render("redirect.ejs");
})

//saving 
function saveDataToFile(){

    fs.writeFile("contact.db",JSON.stringify(contacts),function(err){
        if(err)
            console.log(err);
    })

    fs.writeFile("setti.db",JSON.stringify(settings),function(err){
        if(err)
            console.log(err);
    })
}


function loadDataFromFile(){
    fs.readFile("contact.db",function(err,data){
        if(err){
            console.log(err)
        }else{
            contacts = JSON.parse(data);
        }
    })
    fs.readFile("setti.db",function(err,data){
        if(err){
            console.log(err)
        }else{
            settings = JSON.parse(data);
        }
    })
}


loadDataFromFile();














app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
  
