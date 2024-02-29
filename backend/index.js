const express = require("express");
const app = express();
const mainRouter =require("./routes/index")
const userRouter =require("./routes/user")
const PORT = 3000;
const cors = require("cors");
app.use(cors());
app.use(express.json()); //body parser
var cors = require('cors')
app.use("/api/v1",mainRouter)
app.use("/api/v1",userRouter)

 
 
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})