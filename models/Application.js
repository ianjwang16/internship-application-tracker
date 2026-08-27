const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({

    company: {
        type: String,
        required: true
    },

    position: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Saved"
    },

    location: {
        type: String
    },

    jobLink: {
        type: String
    },

    dateApplied: {
        type: Date
    },

    notes: {
        type: String
    }

}, {
    timestamps: true
});

const Application = mongoose.model(
    "Application",
    applicationSchema
);

module.exports = Application;