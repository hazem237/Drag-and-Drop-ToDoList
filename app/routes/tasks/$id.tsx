import React from "react";
import { Link } from "react-router-dom";

const $id = () => {
  return (
    <div className="add-task-container">
      <form method="post" className="add-task-form">
        <div className="form-header">
          {" "}
          <h2>New Task</h2>
          <Link to={".."}>X</Link>
        </div>
        <label>title</label>
        <input type={"text"} />
        <label>content</label>
        <textarea />
        <button type="submit" className="button">
          Create task
        </button>
      </form>
    </div>
  );
};

export default $id;
