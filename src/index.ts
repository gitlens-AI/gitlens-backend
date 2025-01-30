import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import router from "./routes/index";
import errorHandler from "./middleware/errorHandlingMiddleware";
import sequelize from "./db";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use(errorHandler);

const PORT = process.env.PORT ?? 8000;

const start = async () => {
    try {
        // Connect to DB
        await sequelize.authenticate();
        await sequelize.sync();

        // HTTP
        app.listen(PORT, () => {
            console.log("Server started on port: " + PORT);
        });
    } catch (e: any) {
        console.error(e.message);
    }
};

start();
