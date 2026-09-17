import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [applications, setApplications] = useState([]);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [dateApplied, setDateApplied] = useState(
  new Date().toISOString().split("T")[0]
);

  const [location, setLocation] = useState("");
const [jobLink, setJobLink] = useState("");
const [notes, setNotes] = useState("");
const [editingId, setEditingId] = useState(null);

  // GET all applications
  useEffect(() => {
    fetch("/api/applications")
      .then((response) => response.json())
      .then((data) => {
        setApplications(data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      });
  }, []);

  // POST new application
  const handleSubmit = async (event) => {
  event.preventDefault();

  const applicationData = {
    company,
    position,
    status,
    dateApplied,
    location,
    jobLink,
    notes,
  };

  try {
    if (editingId) {
      // UPDATE existing application
      const response = await fetch(
        `/api/applications/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update application");
      }

      const updatedApplication = await response.json();

      setApplications(
        applications.map((application) =>
          application._id === editingId
            ? updatedApplication
            : application
        )
      );

      setEditingId(null);

    } else {
      // CREATE new application
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error("Failed to add application");
      }

      const savedApplication = await response.json();

      setApplications([
        ...applications,
        savedApplication
      ]);
    }

    // Clear form
    setCompany("");
    setPosition("");
    setStatus("Applied");
    setLocation("");
    setJobLink("");
    setNotes("");

    setDateApplied(
      new Date().toISOString().split("T")[0]
    );

  } catch (error) {
    console.error(
      "Error saving application:",
      error
    );
  }
};

  // DELETE application
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      setApplications(
        applications.filter((application) => application._id !== id)
      );
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  // UPDATE application status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application");
      }

      const updatedApplication = await response.json();

      setApplications(
        applications.map((application) =>
          application._id === id ? updatedApplication : application
        )
      );
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const handleEdit = (application) => {
  setEditingId(application._id);

  setCompany(application.company);
  setPosition(application.position);
  setStatus(application.status);
  setLocation(application.location || "");
  setJobLink(application.jobLink || "");
  setNotes(application.notes || "");

  setDateApplied(
    application.dateApplied
      ? application.dateApplied.split("T")[0]
      : ""
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

  // FILTER + SEARCH
  const filteredApplications = applications.filter((application) => {
    const matchesStatus =
      filter === "All" || application.status === filter;

    const matchesSearch =
      application.company.toLowerCase().includes(search.toLowerCase()) ||
      application.position.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <h1>Internship Application Tracker</h1>

      {/* ADD APPLICATION */}
      <h2>Add Application</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Company:</label>

          <input
            type="text"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            placeholder="Microsoft"
            required
          />
        </div>

        <div>
          <label>Position:</label>

          <input
            type="text"
            value={position}
            onChange={(event) => setPosition(event.target.value)}
            placeholder="Software Engineer Intern"
            required
          />
        </div>

        <div>
  <label>Location:</label>

  <input
    type="text"
    value={location}
    onChange={(event) => setLocation(event.target.value)}
    placeholder="New York, NY"
  />
</div>

<div>
  <label>Job Link:</label>

  <input
    type="url"
    value={jobLink}
    onChange={(event) => setJobLink(event.target.value)}
    placeholder="https://company.com/job"
  />
</div>

        <div>
  <label>Date Applied:</label>

  <input
    type="date"
    value={dateApplied}
    onChange={(event) => setDateApplied(event.target.value)}
    required
  />
</div>

        <div>
          <label>Status:</label>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="Saved">Saved</option>
  <option value="Applied">Applied</option>
  <option value="OA">OA</option>
  <option value="Interview">Interview</option>
  <option value="Offer">Offer</option>
  <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
  <label>Notes:</label>

  <textarea
    value={notes}
    onChange={(event) => setNotes(event.target.value)}
    placeholder="Recruiter contact, interview details, follow-up..."
  />
</div>

        <button type="submit">
  {editingId
    ? "Update Application"
    : "Add Application"}
</button>

{editingId && (
  <button
    type="button"
    onClick={() => {
      setEditingId(null);
      setCompany("");
      setPosition("");
      setStatus("Applied");
      setLocation("");
      setJobLink("");
      setNotes("");

      setDateApplied(
        new Date().toISOString().split("T")[0]
      );
    }}
  >
    Cancel
  </button>
)}
      </form>

      {/* DASHBOARD */}
      <h2>Dashboard</h2>

<div className="dashboard">

  <div className="dashboard-card">
    <h3>Total</h3>
    <p>{applications.length}</p>
  </div>

  <div className="dashboard-card">
    <h3>Saved</h3>
    <p>
      {applications.filter(
        app => app.status === "Saved"
      ).length}
    </p>
  </div>

  <div className="dashboard-card">
    <h3>Applied</h3>
    <p>
      {applications.filter(
        app => app.status === "Applied"
      ).length}
    </p>
  </div>

  <div className="dashboard-card">
    <h3>OA</h3>
    <p>
      {applications.filter(
        app => app.status === "OA"
      ).length}
    </p>
  </div>

  <div className="dashboard-card">
    <h3>Interview</h3>
    <p>
      {applications.filter(
        app => app.status === "Interview"
      ).length}
    </p>
  </div>

  <div className="dashboard-card">
    <h3>Offer</h3>
    <p>
      {applications.filter(
        app => app.status === "Offer"
      ).length}
    </p>
  </div>

  <div className="dashboard-card">
    <h3>Rejected</h3>
    <p>
      {applications.filter(
        app => app.status === "Rejected"
      ).length}
    </p>
  </div>

</div>

      {/* SEARCH + FILTER */}
      <div className="controls">
        <div>
          <label>Search:</label>

          <input
            type="text"
            placeholder="Search company or position"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div>
          <label>Filter:</label>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All</option>
  <option value="Saved">Saved</option>
  <option value="Applied">Applied</option>
  <option value="OA">OA</option>
  <option value="Interview">Interview</option>
  <option value="Offer">Offer</option>
  <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* APPLICATION TABLE */}
<h2>My Applications</h2>

{filteredApplications.length === 0 ? (
  <p>No applications found.</p>
) : (
  <table>
    <thead>
      <tr>
        <th>Company</th>
        <th>Position</th>
        <th>Location</th>
        <th>Date Applied</th>
        <th>Status</th>
        <th>Job</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {filteredApplications.map((application) => (
        <tr key={application._id}>

          <td>{application.company}</td>

          <td>{application.position}</td>

          <td>{application.location || "—"}</td>

          <td>
            {application.dateApplied
              ? new Date(application.dateApplied).toLocaleDateString(
                  "en-US",
                  { timeZone: "UTC" }
                )
              : "—"}
          </td>

          <td>
            <select
              value={application.status}
              onChange={(event) =>
                handleStatusChange(
                  application._id,
                  event.target.value
                )
              }
            >
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="OA">OA</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </td>

          <td>
            {application.jobLink ? (
              <a
                href={application.jobLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Job
              </a>
            ) : (
              "—"
            )}
          </td>

          <td>
  <button
    onClick={() => handleEdit(application)}
  >
    Edit
  </button>

  <button
    onClick={() =>
      handleDelete(application._id)
    }
  >
    Delete
  </button>
</td>

        </tr>
      ))}
    </tbody>
  </table>
)}
    </div>
  );
}

export default App;