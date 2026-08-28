const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true
    },

    position: {
        type: String,
        required: true,
        trim: true
    },

    status: {
        type: String,
        enum: [
            "Saved",
            "Applied",
            "OA",
            "Interview",
            "Offer",
            "Rejected"
        ],
        default: "Saved"
    },

    location: {
        type: String,
        trim: true
    },

    jobLink: {
        type: String,
        trim: true
    },

    dateApplied: {
        type: Date
    },

    notes: {
        type: String,
        trim: true
    }

}, {
    timestamps: true
});

const Application =
    mongoose.model("Application", applicationSchema);

module.exports = Application;