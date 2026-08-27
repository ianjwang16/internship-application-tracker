
const table = document.getElementById("applicationTable");

async function loadApplications() {

    const filterStatus =
        document.getElementById("filterStatus").value;

    const searchCompany =
        document.getElementById("searchCompany").value;

    let url = "/api/applications";

    const params = [];

    if (filterStatus) {
        params.push(
            `status=${encodeURIComponent(filterStatus)}`
        );
    }

    if (searchCompany) {
        params.push(
            `company=${encodeURIComponent(searchCompany)}`
        );
    }

    if (params.length > 0) {
        url += "?" + params.join("&");
    }

    const response = await fetch(url);

    const applications = await response.json();

    table.innerHTML = "";

    applications.forEach(application => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${application.company}</td>
            <td>${application.position}</td>

            <td>
                <select
                    onchange="updateStatus('${application._id}', this.value)"
                >
                    <option value="Saved"
                        ${application.status === "Saved" ? "selected" : ""}>
                        Saved
                    </option>

                    <option value="Applied"
                        ${application.status === "Applied" ? "selected" : ""}>
                        Applied
                    </option>

                    <option value="OA"
                        ${application.status === "OA" ? "selected" : ""}>
                        OA
                    </option>

                    <option value="Interview"
                        ${application.status === "Interview" ? "selected" : ""}>
                        Interview
                    </option>

                    <option value="Offer"
                        ${application.status === "Offer" ? "selected" : ""}>
                        Offer
                    </option>

                    <option value="Rejected"
                        ${application.status === "Rejected" ? "selected" : ""}>
                        Rejected
                    </option>
                </select>
            </td>

            <td>${application.location || ""}</td>

            <td>
                <button
                    onclick="deleteApplication('${application._id}')">
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);
    });
}

const form =
    document.getElementById("applicationForm");

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const application = {
        company:
            document.getElementById("company").value,

        position:
            document.getElementById("position").value,

        status:
            document.getElementById("status").value,

        location:
            document.getElementById("location").value
    };

    const response = await fetch("/api/applications", {
    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify(application)
});

const result = await response.json();

console.log("POST status:", response.status);
console.log("POST result:", result);

if (!response.ok) {
    alert(result.message);
    return;
}

form.reset();

loadApplications();
loadStats();
});

async function deleteApplication(id) {

    await fetch(`/api/applications/${id}`, {
        method: "DELETE"
    });

    loadApplications();
    loadStats();
}

async function updateStatus(id, newStatus) {

    const response = await fetch(
        `/api/applications/${id}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                status: newStatus
            })
        }
    );

    if (!response.ok) {
        console.error("Failed to update status");
        return;
    }

    loadApplications();
    loadStats();
}

const filterStatus =
    document.getElementById("filterStatus");

filterStatus.addEventListener(
    "change",
    loadApplications
);

const searchCompany =
    document.getElementById("searchCompany");

searchCompany.addEventListener(
    "input",
    loadApplications
);

async function loadStats() {

    const response =
        await fetch("/api/applications");

    const applications =
        await response.json();

    document.getElementById("totalCount").textContent =
        applications.length;

    document.getElementById("appliedCount").textContent =
        applications.filter(
            application =>
                application.status === "Applied"
        ).length;

    document.getElementById("interviewCount").textContent =
        applications.filter(
            application =>
                application.status === "Interview"
        ).length;

    document.getElementById("offerCount").textContent =
        applications.filter(
            application =>
                application.status === "Offer"
        ).length;

    document.getElementById("rejectedCount").textContent =
        applications.filter(
            application =>
                application.status === "Rejected"
        ).length;
}

loadApplications();
loadStats();