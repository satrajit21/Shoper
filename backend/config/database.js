const mongoose= require('mongoose');
const connecttodatabase= ()=>{
    mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true

    }).then(con=>{
        console.log(`MongoDB Database connected to Host:${con.connection.host}`)
    })
}
module.exports=connecttodatabase;