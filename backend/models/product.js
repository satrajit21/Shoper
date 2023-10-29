const  mongoose=require('mongoose')


const productSchema=new mongoose.Schema({
    name: {
        type:String,
        required:[true,'Please enter product name'],
        trim: true,
        maxLength:[100,'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required : [true,'Please enter product price'],
        default: 0.0,
        maxLength: [5,'product price cannot exceed 5 characters']
    },
    description: {
        type: String,
        required: [true,'Please enter product description'],
    },
    ratings: {
        type: Number,
        default:0
    },
    images: [
        {
            public_id: {
                type: String,
                required:true
            },
            url:{
                type: String,
                required:true
            }
        }
    ],
    category: {
        type: String,
        required: [true,'Please select a category for the product'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Mobile',
                'Accessories',
                'Headphones',
                'Clothes/Shoes',
                'Baby Items',
                'Makeup',
                'Health/Fitness',
                'Food',
                'Sports',
                'Home',
                'Books',
                'Laptops',
                'Beauty/Health',
                'Outdoor'
            ],
            message: 'Please select correct category for products'
        }
    },
    seller: {
        type: String,
        required: [true,'Please Enter product seller']
    },
    stock: {
        type: Number,
        required:[true,'please enter no of stock of product'],
        maxLength: [5,'exceeding length...error..max=5']
    },
    numofReviews: {
        type: Number,
        default:0
    },
    reviews: [
        {
            user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
           },
            name:{
                type: String,
                required:true,
            },
            rating: {
                type: Number,
                required:true,
                default: 0
            },
            comment: {
                type: String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:false
       },
    createdAt: {
        type: Date,
        default:Date.now
    }
})

module.exports=mongoose.model('Product',productSchema);