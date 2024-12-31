import React from "react";

const AssignmentCard = ({ title, description, dueDate, aura_point, author }) => {
  return (
    <div className="assignment-card-container">
      <div className="assignment-card">
        <h2 className="assignment-card-title">{title}</h2>
        {/* <p className="assignment-card-description">{description}</p> */}
        <div className="assignment-card-details">
          <p><strong>Due Date:</strong> {new Date(dueDate).toLocaleDateString()}</p>
          <p><strong>Aura Points:</strong> {aura_point}</p>
          <p><strong>Author:</strong> {author.username}</p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
