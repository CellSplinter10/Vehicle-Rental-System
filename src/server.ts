import {port} from "./configuration/config";
import app from "./app";



app.listen(port,()=>{
    console.log(`app is running on port : ${port}`);
});