import React, { useState, useEffect } from "react";
import Sidebar from "../Layout/Sidebar";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState({
    username: "",
    role: "student",
    section: "",
    semester: "",
    branch: "",
    avatar: "",
  });

  const [assignments, setAssignments] = useState({
    created: [],
    completed: [],
    uncompleted: [],
  });

  const [projects, setProjects] = useState({
    completed: [],
    uncompleted: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUserData(data.user);

        if (data.user.role === "teacher") {
          const createdResponse = await fetch("http://localhost:3000/assignments/created", {
            method: "GET",
            credentials: "include",
          });
          if (!createdResponse.ok) throw new Error("Failed to fetch created assignments");
          const createdData = await createdResponse.json();
          setAssignments((prev) => ({ ...prev, created: createdData }));
        } else if (data.user.role === "student") {
          const [completedResponse, uncompletedResponse, completedProjectsResponse, uncompletedProjectsResponse] = await Promise.all([
            fetch("http://localhost:3000/assignments/completed", { method: "GET", credentials: "include" }),
            fetch("http://localhost:3000/assignments/uncompleted", { method: "GET", credentials: "include" }),
            fetch("http://localhost:3000/projects/completed", { method: "GET", credentials: "include" }),
            fetch("http://localhost:3000/projects/uncompleted", { method: "GET", credentials: "include" }),
          ]);

          if (
            !completedResponse.ok ||
            !uncompletedResponse.ok ||
            !completedProjectsResponse.ok ||
            !uncompletedProjectsResponse.ok
          )
            throw new Error("Failed to fetch student data");

          const [completedData, uncompletedData, completedProjectsData, uncompletedProjectsData] = await Promise.all([
            completedResponse.json(),
            uncompletedResponse.json(),
            completedProjectsResponse.json(),
            uncompletedProjectsResponse.json(),
          ]);

          setAssignments((prev) => ({
            ...prev,
            completed: completedData,
            uncompleted: uncompletedData,
          }));

          setProjects({
            completed: completedProjectsData.completedProjects,
            uncompleted: uncompletedProjectsData.uncompletedProjects,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!userData.username) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-container">
        <div className="user-info">
          <div className="avatar">
            {userData.avatar ? (
              <img src={userData.avatar} alt="Avatar" />
            ) : (
              <div className="default-avatar">No Avatar</div>
            )}
          </div>
          <div className="user-details">
            <h2>{userData.username}</h2>
            <p>
              <strong>Role:</strong> {userData.role}
            </p>
            <p>
              <strong>Section:</strong> {userData.section}
            </p>
            <p>
              <strong>Semester:</strong> {userData.semester}
            </p>
            <p>
              <strong>Branch:</strong> {userData.branch}
            </p>
          </div>
        </div>

        <div className="assignments">
          {userData.role === "teacher" ? (
            <div>
              <h3>Created Assignments</h3>
              <ul>
                {assignments.created.length > 0 ? (
                  assignments.created.map((assignment) => (
                    <li key={assignment._id}>{assignment.title}</li>
                  ))
                ) : (
                  <p>No created assignments yet</p>
                )}
              </ul>
              <Link to="/create-project" className="create-assignment-link">
                Create a New Project
              </Link>
            </div>
          ) : (
            <div>
              <h3>Uncompleted Assignments</h3>
              <ul>
                {assignments.uncompleted.length > 0 ? (
                  assignments.uncompleted.map((assignment) => (
                    <li key={assignment._id}>{assignment.title}</li>
                  ))
                ) : (
                  <p>No uncompleted assignments</p>
                )}
              </ul>
              <h3>Completed Assignments</h3>
              <ul>
                {assignments.completed.length > 0 ? (
                  assignments.completed.map((assignment) => (
                    <li key={assignment._id}>{assignment.title}</li>
                  ))
                ) : (
                  <p>No completed assignments yet</p>
                )}
              </ul>
              <h3>Uncompleted Projects</h3>
              <ul>
                {projects.uncompleted.length > 0 ? (
                  projects.uncompleted.map((project) => (
                    <li key={project._id}>{project.title}</li>
                  ))
                ) : (
                  <p>No uncompleted projects</p>
                )}
              </ul>
              <h3>Completed Projects</h3>
              <ul>
                {projects.completed.length > 0 ? (
                  projects.completed.map((project) => (
                    <li key={project._id}>{project.title}</li>
                  ))
                ) : (
                  <p>No completed projects yet</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
