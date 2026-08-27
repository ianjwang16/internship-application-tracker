
const table = document.getElementById("applicationTable");

async function loadApplications() {

    const response =
        await fetch("/api/applications");

    const applications =
        await response.json();

    table.innerHTML = "";

    applications.forEach(application => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${application.company}</td>
            <td>${application.position}</td>
            <td>${application.status}</td>
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

loadApplications();

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
});

async function deleteApplication(id) {

    await fetch(`/api/applications/${id}`, {
        method: "DELETE"
    });

    loadApplications();
}