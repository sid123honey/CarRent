const mongoose = require('mongoose');

function connectDB(){
    mongoose.connect("mongodb+srv://sid:Bk54VayFcXNkP6mr@cluster0.dcd4syd.mongodb.net/Car-Rent",{
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      const connection = mongoose.connection
      connection.on('connected',()=>{
        console.log("Mongodb cnnected");
      })
      connection.on('error',()=>{
        console.log("Mongodb error");
      })
}

connectDB();
module.exports = mongoose;