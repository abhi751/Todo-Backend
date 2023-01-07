const express=require("express");
const app=express()
const dontenv= require("dontenv").config();

const cors=require("cors");
const connection=require("./database/db")

app.use(express.json())
app.use(express.urlencoded({extended:false}))

const PORT=process.env.PORT || 3000

app.use(cors())
app.use("/api/v1/user",require("./routes/UserRouters"))

app.use("/api/v1/todo",require("./routes/TodoRouter"))

connection()

app.listen(PORT,()=>{
    console.log(`server connected successfully at the ${PORT}`);
})