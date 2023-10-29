const app = require('./app');
const connecttodatabase=require('./config/database')

const dotenv = require('dotenv');
const { $where } = require('./models/product');
const cloudinary=require('cloudinary');
//Handling Uncaught Exception
process.on('uncaughtException',err=>{
    console.log(`ERROR: ${err.stack}`);
    console.log(`Shutting down due to uncaught Exception`);
    process.exit(1)
})

// Setting up config file
dotenv.config({path:'backend/config/config.env'})

//Setting up cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})


//Connecting to database
connecttodatabase();
const server=app.listen(process.env.PORT, () =>{
    console.log(`server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

//Handle Unhandled Promise Rejection
process.on('unhandledRejection',err=>{
    console.log(`ERROR:${err.stack}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1)
    })
})