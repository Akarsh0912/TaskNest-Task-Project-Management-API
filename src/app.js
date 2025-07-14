import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import allRoutes from "./routes/index.routes.js"
import {startTaskReminder} from "./cronJobs/job.js"
import swaggerUi from "swagger-ui-express";
import fs from "fs";
const swaggerDocument = JSON.parse(fs.readFileSync("./src/swagger.json", "utf-8"));

const app = express()

app.use(cors({
    origin:process.env.CORN_ORIGIN,
    credentials:true
}));

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}));
app.use(cookieParser())


//health check route
app.get("/health-check",(_,res)=>{
    res.status(200).json({
        success:true,
        message:"This is a Health check route. Server is running fine"
    })
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api",allRoutes)

startTaskReminder();




export {app}
