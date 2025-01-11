import React, { useContext, useState } from 'react';
import Sidebar from '../Layout/Sidebar';
import { UserContext } from '../UserContext';

const ProjectForm = () => {
  // const response = await fetch("http://localhost:3000/profile", {
  //   method: "GET",
  //   credentials: "include", // Include cookies in the request
  // });
  // if (!response.ok) throw new Error("Failed to fetch user profile");
  // const data = await response.json();
  // setUserData(data.user);

  // if (data.user.role === "teacher") 
  const {userInfo}=useContext(UserContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    files: [],
    teacherFiles: [], // Added field for teacher files
  });

  const [feedback, setFeedback] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: Array.from(files), // Dynamic handling for student or teacher files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, tags, files, teacherFiles } = formData;

    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('tags', tags);
    files?.forEach((file) => data.append('files', file));
    teacherFiles.forEach((file) => data.append('teacherFiles', file));

    try {
      const response = await fetch('http://localhost:3000/projects', {
        method: 'POST',
        credentials: 'include',
        body: data,
      });

      if (response.ok) {
        setFeedback('Project created successfully!');
        setFormData({ title: '', description: '', tags: '', files: [], teacherFiles: [] });
      } else {
        const errorData = await response.json();
        setFeedback(`Error: ${errorData.message}`);
      }
    } catch (err) {
      setFeedback('An error occurred while creating the project.');
    }
  };

  return (
    <div>
      <Sidebar />
      <h1>Create Project</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </label>
        <br />
        <label>
          Tags (comma-separated):
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
          />
        </label>
        <br />
        {/* <label>
          Student Files:
          <input
            type="file"
            name="files"
            multiple
            onChange={handleFileChange}
          />
        </label>
        <br /> */}
        <label>
          Teacher Files:
          <input
            type="file"
            name="teacherFiles"
            multiple
            onChange={handleFileChange}
          />
        </label>
        <br />
        <button type="submit">Create Project</button>
      </form>
      {feedback && <p>{feedback}</p>}
    </div>
  );
};

export default ProjectForm;
