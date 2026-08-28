
const table = document.getElementById("applicationTable");

let editingId = null;

async function loadApplications() {

    try {

        const filterStatus =
            document.getElementById("filterStatus").value;

        const searchCompany =
            document.getElementById("searchCompany").value;

        const sortBy =
            document.getElementById("sortBy").value;

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

        if (!response.ok) {
            throw new Error("Failed to load applications");
        }

        let applications =
            await response.json();

        if (sortBy === "company") {
            applications.sort((a, b) =>
                a.company.localeCompare(b.company)
            );
        }

        if (sortBy === "status") {
            applications.sort((a, b) =>
                a.status.localeCompare(b.status)
            );
        }

        if (sortBy === "newest") {
            applications.sort((a, b) =>
                new Date(b.createdAt) -
                new Date(a.createdAt)
            );
        }

        table.innerHTML = "";

        const emptyMessage =
            document.getElementById("emptyMessage");

        if (applications.length === 0) {
            emptyMessage.style.display = "block";
        } else {
            emptyMessage.style.display = "none";
        }

        applications.forEach(application => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${application.company}</td>
                <td>${application.position}</td>

                <td>
                    <select
                        onchange="updateStatus(
                            '${application._id}',
                            this.value
                        )"
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
    ${
        application.dateApplied
            ? new Date(application.dateApplied).toLocaleDateString()
            : ""
    }
</td>

<td>
    ${
        application.jobLink
            ? `<a href="${application.jobLink}"
                  target="_blank">
                  View Job
               </a>`
            : ""
    }
</td>

<td>
    <button
        onclick="editApplication('${application._id}')">
        Edit
    </button>

    <button
        onclick="deleteApplication('${application._id}')">
        Delete
    </button>
</td>
            `;

            table.appendChild(row);
        });

    } catch (error) {

        console.error(error);

        document.getElementById(
            "emptyMessage"
        ).textContent =
            "Unable to load applications.";
    }
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
            document.getElementById("location").value,

        jobLink:
            document.getElementById("jobLink").value,

        dateApplied:
            document.getElementById("dateApplied").value,

        notes:
            document.getElementById("notes").value
    };

    let url = "/api/applications";
    let method = "POST";

    if (editingId) {
        url = `/api/applications/${editingId}`;
        method = "PUT";
    }
    try{
        const response = await fetch(url, {
            method: method,

         headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(application)
    });

    const result = await response.json();

    if (!response.ok) {
        alert(result.message);
        return;
    }

    form.reset();

    editingId = null;

    document.getElementById("submitButton").textContent =
        "Add Application";

    loadApplications();
    loadStats();

} catch (error) {
    console.error(error);

    alert(
        "Could not connect to the server. Please try again."
    );
}
});   // closes form.addEventListener

async function deleteApplication(id) {

    const confirmed =
        confirm("Are you sure you want to delete this application?");

    if (!confirmed) {
        return;
    }

    const response =
        await fetch(`/api/applications/${id}`, {
            method: "DELETE"
        });

    if (!response.ok) {
        alert("Failed to delete application");
        return;
    }

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

const sortBy =
    document.getElementById("sortBy");

sortBy.addEventListener(
    "change",
    loadApplications
);

async function loadStats() {

    const response =
        await fetch("/api/applications");

    const applications =
        await response.json();

    const total = applications.length;

    const appliedCount =
        applications.filter(
            application =>
                application.status === "Applied"
        ).length;

    const interviewCount =
        applications.filter(
            application =>
                application.status === "Interview"
        ).length;

    const offerCount =
        applications.filter(
            application =>
                application.status === "Offer"
        ).length;

    const rejectedCount =
        applications.filter(
            application =>
                application.status === "Rejected"
        ).length;

    document.getElementById("totalCount").textContent =
        total;

    document.getElementById("appliedCount").textContent =
        appliedCount;

    document.getElementById("interviewCount").textContent =
        interviewCount;

    document.getElementById("offerCount").textContent =
        offerCount;

    document.getElementById("rejectedCount").textContent =
        rejectedCount;

    let interviewRate = 0;
    let offerRate = 0;

    if (total > 0) {

        interviewRate =
            Math.round(
                (interviewCount / total) * 100
            );

        offerRate =
            Math.round(
                (offerCount / total) * 100
            );
    }

    document.getElementById("interviewRate").textContent =
        interviewRate + "%";

    document.getElementById("offerRate").textContent =
        offerRate + "%";
}

async function editApplication(id) {

    const response =
        await fetch(`/api/applications/${id}`);

    if (!response.ok) {
        console.error("Failed to load application");
        return;
    }

    const application =
        await response.json();

    document.getElementById("company").value =
        application.company || "";

    document.getElementById("position").value =
        application.position || "";

    document.getElementById("status").value =
        application.status || "Saved";

    document.getElementById("location").value =
        application.location || "";

    document.getElementById("jobLink").value =
        application.jobLink || "";

    document.getElementById("notes").value =
        application.notes || "";

    if (application.dateApplied) {
        document.getElementById("dateApplied").value =
            application.dateApplied.substring(0, 10);
    }

    editingId = id;

    document.getElementById("submitButton").textContent =
        "Update Application";
}

loadApplications();
loadStats();