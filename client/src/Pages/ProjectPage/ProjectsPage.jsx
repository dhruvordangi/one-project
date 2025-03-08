import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3000/projects/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch project details. Status: ${response.status}`);
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError("Failed to fetch project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleNavigate = () => {
    navigate("/create-project");
  };

  const handleSubmitProject = async () => {
    try {
      const response = await fetch(`http://localhost:3000/projects/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Submitted" }),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit project. Status: ${response.status}`);
      }

      setProject((prevProject) => ({
        ...prevProject,
        status: "Submitted",
      }));
    } catch (err) {
      alert("Error submitting project: " + err.message);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.projectPage}>
      {project && (
        <div style={styles.projectContainer}>
          <h1 style={styles.projectTitle}>{project.title || "Untitled Project"}</h1>
          <p style={styles.projectDescription}>{project.description || "No description available."}</p>

          <div style={styles.projectSection}>
            <h2>Submitter:</h2>
            <p>{project.submitter ? project.submitter.name : "Unknown"}</p>
          </div>

          <div style={styles.projectSection}>
            <h2>Files:</h2>
            {project.files?.length > 0 ? (
              project.files.map((file, index) => (
                <div key={index} style={styles.fileItem}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
                    {file.fileType?.toUpperCase() || "Unknown"} File
                  </a>
                </div>
              ))
            ) : (
              <p>No files uploaded.</p>
            )}
          </div>

          <div style={styles.projectSection}>
            <h2>Status:</h2>
            <p>{project.status || "Unknown"}</p>
          </div>

          <div style={styles.projectSection}>
            <h2>Tags:</h2>
            {project.tags?.length > 0 ? (
              <ul>
                {project.tags.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            ) : (
              <p>No tags available.</p>
            )}
          </div>

          {project.feedback && (
            <div style={styles.projectSection}>
              <h2>Feedback:</h2>
              <p>{project.feedback}</p>
            </div>
          )}

          {/* Submit Project Button */}
          <div style={styles.projectSection}>
            <button
              onClick={handleNavigate}
              disabled={project.status === "Submitted"}
              style={project.status === "Submitted" ? styles.disabledButton : styles.submitButton}
            >
              {project.status === "Submitted" ? "Project Submitted" : "Submit Project"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  projectPage: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f4f4f9",
    padding: "20px",
  },
  projectContainer: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "90%",
    maxWidth: "700px",
  },
  projectTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  projectDescription: {
    fontSize: "16px",
    color: "#555",
    textAlign: "center",
    marginBottom: "15px",
  },
  projectSection: {
    marginTop: "15px",
    padding: "15px",
    background: "#f9f9f9",
    borderRadius: "8px",
  },
  fileItem: {
    margin: "8px 0",
  },
  fileLink: {
    textDecoration: "none",
    color: "#007bff",
    fontWeight: "bold",
    transition: "0.3s",
  },
  submitButton: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    background: "#28a745",
    color: "white",
    transition: "0.3s",
  },
  disabledButton: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
    background: "#ccc",
    color: "#666",
    cursor: "not-allowed",
  },
  navigateButton: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
    background: "#007bff",
    color: "white",
    transition: "0.3s",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
    color: "red",
  },
};

export default ProjectPage;
