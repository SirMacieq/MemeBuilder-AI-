import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
export const app = express();
import cors from "cors";
import MongoConnect from '../database/mongo'
import { router } from './routes/router';

export const server = http.createServer(app);

export default {
    start: (port: number | string, dependencies: any) => {
      app.use(cors()); /* NEW */
  
      //Middlewares
      app.use(express.json());
      app.use(
        express.urlencoded({
          extended: true,
        })
      );
  
      app.set("view engine", "ejs");

      app.use('/api/v1', router);
  
      //Routes
      app.get("/", async (req, res) => {
        res.json({ status: 200, msg: "Welcome to MemeBuilder-AI API" }); 
      });
      
      //Common Error handler
  
      // app.use(ErrorHandler);
  
      server.listen(port, () => {
        console.log(`Connected to the port ${port}`);
        console.log(`You are in ${process.env.ENV_REPOSITORIES} mode`);
  
        if (process.env.ENV_REPOSITORIES === "mongo") {
          MongoConnect.connect();
        }
      });
    },
    end: () => {
      server.close();
    },
  };