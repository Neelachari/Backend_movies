const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connection = require("./Config/db");
const signupRouter = require("./Routes/Signup.route");
const loginRouter = require("./Routes/Login.route"); // Assuming you have this route
const movieRouter = require("./Routes/movies.route");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/users", signupRouter);
app.use("/users", loginRouter);
app.use("/movies", movieRouter);

app.get("/", (req, res) => {
    res.send("Welcome to Movies");
});

app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("Server Running on Port", process.env.PORT);
    } catch (error) {
        console.log("Failed to connect to the database:", error);
    }
});
