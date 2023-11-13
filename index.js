const mongoose=require("mongoose");
const express=require("express");
const app=express();
app.use(express.json());
const port=process.env.PORT||3000;
const userRoute=require("./routes/userRoutes");
// app.get("/",(req,res)=>{
//     res.send("Shri SHivay Namastubhyam");
// });
app.use("/",userRoute);


// app.listen(port,()=>{
//     console.log(`Server is running at port ${port}`);
// });
mongoose.connect("mongodb://0.0.0.0:27017/AntiLostGlassesFinal").then(() => {
    app.listen(port, () => {
        console.log('listening on PORT ' + port);
        console.log('Conected to db');
})
}
)