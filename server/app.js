require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("./DB/conn");
const router=require("./Routes/router")
const PORT = 4002;

app.use(express.json());
app.use(cors());
app.use(router);

app.get("/", (req, res) => {
    res.status(200).json("server start");
})

app.listen(PORT, () => {
    console.log(`Server start at Port No :${PORT}`);
});
