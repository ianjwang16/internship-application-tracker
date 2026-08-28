require("dotenv").config();

const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");
const Application = require("../models/Application");

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

test("GET /api/applications returns applications", async () => {

    const response =
        await request(app)
            .get("/api/applications");

    expect(response.statusCode).toBe(200);

    expect(Array.isArray(response.body))
        .toBe(true);
});

test("POST /api/applications creates an application", async () => {

    const response =
        await request(app)
            .post("/api/applications")
            .send({
                company: "Test Company",
                position: "Software Engineering Intern",
                status: "Applied",
                location: "Test Location"
            });

    expect(response.statusCode).toBe(201);

    expect(response.body.company)
        .toBe("Test Company");

    expect(response.body.status)
        .toBe("Applied");

    await Application.findByIdAndDelete(
        response.body._id
    );
});

test("POST /api/applications fails without company", async () => {

    const response =
        await request(app)
            .post("/api/applications")
            .send({
                position: "Software Engineering Intern",
                status: "Applied"
            });

    expect(response.statusCode).toBe(400);
});

test("PUT /api/applications/:id updates status", async () => {

    const application =
        await Application.create({
            company: "Test Company",
            position: "Software Engineering Intern",
            status: "Applied"
        });

    const response =
        await request(app)
            .put(`/api/applications/${application._id}`)
            .send({
                status: "Interview"
            });

    expect(response.statusCode).toBe(200);

    expect(response.body.status)
        .toBe("Interview");

    await Application.findByIdAndDelete(
        application._id
    );
});

test("DELETE /api/applications/:id deletes application", async () => {

    const application =
        await Application.create({
            company: "Delete Test",
            position: "Software Engineering Intern",
            status: "Saved"
        });

    const response =
        await request(app)
            .delete(
                `/api/applications/${application._id}`
            );

    expect(response.statusCode).toBe(200);

    const deleted =
        await Application.findById(
            application._id
        );

    expect(deleted).toBeNull();
});