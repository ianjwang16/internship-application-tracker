const express = require("express");

const app = express();
app.use(express.json());

const PORT = 3000;
let applications = [
    {
        id: 1,
        company: "Google",
        position: "Software Engineering Intern",
        status: "Applied"
    },
    {
        id: 2,
        company: "Microsoft",
        position: "Software Engineering Intern",
        status: "Interview"
    }
];

app.get("/api/applications", (req, res) => {
    res.json(applications);
});

app.get("/", (req, res) => {
    res.send("Internship Application Tracker is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/api/applications", (req, res) => {

    const newApplication = {
        id: applications.length + 1,
        company: req.body.company,
        position: req.body.position,
        status: req.body.status
    };

    applications.push(newApplication);

    res.json(newApplication);
});