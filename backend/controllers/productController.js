const Product=require('../models/product')
const catchAysncErrors=require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const APIFeatures=require('../utils/apiFeatures')
//Creating new product => /api/v1/admin/product/new
exports.newProduct= catchAysncErrors( async(req,res,next)=>{
    req.body.user=req.user.id;
    
    const product = await Product.create(req.body);
    res.status(201).json({
        success:true,
        product
    })
})

//Get all product details => /api/v1/products
exports.getProducts=catchAysncErrors(async (req,res,next)=>{
    const resPerPage=8;
    const productCount= await Product.countDocuments();
    const apiFeatures= new APIFeatures(Product.find(),req.query)
        .search()
         .filter()
         let products=await apiFeatures.query;
         let filteredProductsCount=products.length;
         apiFeatures.pagination(resPerPage)
        products= await apiFeatures.query.clone();
    setTimeout(() => {
        res.status(200).json({
            success:true,
            count:products.length,
            productCount,
            resPerPage,
            filteredProductsCount,
            products
        })
    },1000);
})
//Get single product details => /api/v1/product/:id
exports.getSingleProduct = catchAysncErrors(async (req,res,next)=>{
    const product= await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product Not Found', 404));
        }

    res.status(200).json({
       success:true,
       product
    })
})
// update product => /api/v1/products/:id
 exports.updateProduct =catchAysncErrors(async(req,res,next) =>{
    var product= await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product Not Found', 404));
    }
    product= await Product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        success:true,
        product
    })
 })
 
 // Delete Product => /api/v1/admin/product/:id

 exports.deleteProduct= catchAysncErrors(async (req,res,next) => {
    const product=await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler('Product Not Found', 404));
    }
     await product.deleteOne();
     res.status(200).json({
        success:true,
        message:'Product is deleted'
     })
 })

 //Create new review => /api/v1/review
 exports.createProductReview=catchAysncErrors(async(req,res,next)=>{
    const{rating,comment,productId}=req.body;

    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const product= await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r=> r.user.toString()=== req.user._id.toString()
    )

    if(isReviewed){
        product.reviews.forEach(review=>{
            if(review.user.toString()===req.user._id.toString()){
                review.comment=comment;
                review.rating=rating;
            }
        })
    }
    else{
        product.reviews.push(review);
        product.numofReviews=product.reviews.length
    }

    product.ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true
    })
 })

 //Get product reviews =>/api/v1/reviews
 exports.getProductReviews=catchAysncErrors(async(req,res,next)=>{
    const product= await Product.findById(req.query.id);

    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
 })

 //delete product review =>/api/v1/reviews/delete
 exports.deleteReview=catchAysncErrors(async(req,res,next)=>{
    const product= await Product.findById(req.query.productId);

    const reviews=product.reviews.filter(review=>review._id.toString()!==req.query.id.toString());
    const numofReviews=reviews.length;
    const ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/reviews.length

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numofReviews
    },{
        new:true,
        runValidators:false
    })

    res.status(200).json({
        success:true
    })
 })