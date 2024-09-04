const bodyParser = require("body-parser");
const express = require ("express");
const mongoose = require ("mongoose");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/Sample").then(()=>{
console.log("Connected to MongoDB")}).catch((err)=>{
    console.log(err)
})

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
})

const Product = new mongoose.model("Product",productSchema)

//Create Product
app.post("/api/v1/product/new", async(req, res)=>{
   const product = await Product.create(req.body);
    res.status(200).json({
        success: true,
        product
    })
})

//Read Product
app.get("/api/v1/products", async(req, res)=>{
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    })
})

//Update Product
app.put("/api/v1/product/:id", async(req,res)=>{

    let product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            success: false,
            message: "product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        useFindAndModify: false,
        runValidators: true
    })

    res.status(200).json({
        success: true,
        product
    })
})

//Delete Product
app.delete("/api/v1/product/:id", async(req, res)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return res.status(500).json({
            message: "product not found"
        })
    }

    await product.deleteOne()
    res.status(200).json({
        success: true,
        message: "product deleted successfully"
    })
})

app.listen(port, ()=>{
    console.log("Server is working")
})
