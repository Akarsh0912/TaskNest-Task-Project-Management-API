import { connectDB } from "./DB/index.js"
import dotenv from "dotenv"
import  {app} from "./app.js"

dotenv.config()

const PORT  = process.env.PORT || 3000
const HOST = process.env.HOST || "localhost";

const startServer = async ()=>{
    await connectDB();
    app.listen(PORT,'0.0.0.0', (error)=>{
        if(error){
            console.error('Server failed to start:', error);
            throw error
           
        }
        console.log(`Server is running at http://${HOST}:${PORT} 🚀`);
        console.log(`Swagger Docs Link http://${HOST}:${PORT}/api-docs`);
    })

}

startServer();

