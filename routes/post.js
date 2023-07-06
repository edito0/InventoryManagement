const express = require('express');
const router = express.Router()

const mongoose = require('mongoose');
const Product = mongoose.model("Product");
const User = mongoose.model("User")
const requireLogin = require('../middleware/requireLogin')


router.get('/allproducts',requireLogin, (req, res) => {

    Product.find({ postedBy: req.user._id })
        .sort('-createdAt')
        .then(result => {
            res.json({ products: result })
        })
        .catch(err => {
            console.log(err);
        })  
}) 
 


router.post('/uploadproduct', requireLogin, (req, res) => {
    const { title, body, photo, price, category, quantity } = req.body

    if (!title || !body || !photo || !quantity || !price || !category) {
        return res.status(422).json({ error: "Please enter title and body" })
    }

    req.user.password = undefined
    const product = new Product({
        title: title,
        body: body,
        photo: photo,
        price: price,
        quantity: quantity,
        category: category,
        postedBy: req.user
    })

    product.save().then(result => {
        res.json({ product: result })
    })
        .catch(err => {
            console.log(err);
        }) 
})


router.post('/searchproduct', (req, res) => {
    let pattern = "(?i)" + req.body.query + "(?-i)";
    //      /^name/
    // ("(?i)" begins a case-insensitive match.
    // "(?-i)" ends a case-insensitive match.)
    Product.find({ title: { $regex: pattern } })
        .then(data => {
            res.json({ products: data })
        })
        .catch(err => {
            console.log(err);
        })
})

 

router.get('/viewproduct/:productId', requireLogin, (req, res) => {
    Product.findOne({ _id: req.params.productId })
    .populate("postedBy", "email name")
        .then(products => {
            res.json({ products })
        })
        .catch(err => {
            console.log(err); 
        })
})



router.put('/updateproduct', requireLogin, (req, res) => {

    Product.findByIdAndUpdate(req.body.productId, {
        $set: {
            title: req.body.title,
            body: req.body.body,
            photo: req.body.photo,
            price: req.body.price,
            quantity: req.body.quantity,
            category: req.body.category,
        }
    },
        {
            new: true
        })
        .then(result => {
            return res.json(result)
        }
        )
        .catch(err => {
            return res.status(422).json({ error: "Profile Name cannot be Updated" })
        })

})


router.post('/deleteproduct', requireLogin, (req, res) => {
    Product.deleteOne({ _id: req.body.productId })
        .then(post => {
            res.json({ prodcut: post });
        })
        .catch(err => {
            console.log(err);
        })
})


module.exports = router

