require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Application = require("./models/Application");

const app = express();
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("MongoDB connection error:", error);
    });

const PORT = 3000;

// GET all applications or filter by status
app.get("/api/applications", async (req, res) => {
    try {
        const filter = {};

        if (req.query.status) {
            filter.status = req.query.status;
        }

        if (req.query.company) {
            filter.company = {
                $regex: req.query.company,
                $options: "i"
            };
        }

        const applications =
            await Application.find(filter);

        res.json(applications);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// GET one application by ID
app.get("/api/applications/:id", async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json(application);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// UPDATE
app.put("/api/applications/:id", async (req, res) => {
    try {

        const updatedApplication =
            await Application.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedApplication) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json(updatedApplication);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// DELETE
app.delete("/api/applications/:id", async (req, res) => {
    try {
        const deletedApplication =
            await Application.findByIdAndDelete(req.params.id);

        if (!deletedApplication) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        res.json({
            message: "Application deleted"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// CREATE a new application
app.post("/api/applications", async (req, res) => {
    try {
        const newApplication = new Application({
            company: req.body.company,
            position: req.body.position,
            status: req.body.status,
            location: req.body.location,
            jobLink: req.body.jobLink,
            dateApplied: req.body.dateApplied,
            notes: req.body.notes
        });

        const savedApplication =
            await newApplication.save();

        res.status(201).json(savedApplication);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});