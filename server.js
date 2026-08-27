require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Application = require("./models/Application");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

const PORT = 3000;

app.get("/api/applications", async (req, res) => {
    try {
        const applications = await Application.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

app.post("/api/applications", async (req, res) => {
    try {
        const newApplication = new Application({
            company: req.body.company,
            position: req.body.position,
            status: req.body.status
        });

        const savedApplication = await newApplication.save();

        res.json(savedApplication);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.get("/", (req, res) => {
    res.send("Internship Application Tracker is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});