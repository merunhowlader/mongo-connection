const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId= require('mongodb').ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




const password = "4w7KrciXD7iBG2V";

const uri = "mongodb+srv://organicUser:4w7KrciXD7iBG2V@cluster0.z94oz.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



client.connect(err => {
    const ProductCollection = client.db("organicdb").collection("products");

    app.get('/products',(req,res)=>{
        ProductCollection.find({})
        .toArray((err,documents)=>{
            console.log(documents.length);
            res.send(documents);
        })
    })
    app.get('/product/:id',(req,res)=>{
        ProductCollection.find({_id:ObjectId(req.params.id)})
        .toArray((err,documents)=>{
            res.send(documents[0]);
        })
    })

    app.post("/addProduct", (req, res) => {
        const product=req.body;
        console.log(product);
         ProductCollection.insertOne(product)
             .then(result => {
                console.log('one product added');
                res.redirect('/');

             })

    })

    app.patch('/update/:id',(req,res)=>{
        console.log(req.body);
        ProductCollection.updateOne({_id:ObjectId(req.params.id)},
        {
            $set:{price:req.body.price,quantity:req.body.quantity}
        })
        .then(result=>{
            res.send(result.modifiedCount>0);
        })
    })



    app.delete('/delete/:id',(req,res)=>{
        ProductCollection.deleteOne({_id:ObjectId(req.params.id)})
        .then((result)=>{
            res.send(result.deletedCount>0);
        })
    })

    console.log("data base connected");
    // perform actions on the collection object

});

app.listen(3000);