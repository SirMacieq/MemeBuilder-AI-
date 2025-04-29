import dotenv from "dotenv";
dotenv.config();
import dependencies from "./config/dependencies";
import app from './frameworks/express/app';
const PORT = process.env.PORT || 3001;

app.start(PORT, dependencies);