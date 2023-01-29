import { ActionFunction, redirect } from "@remix-run/node";
import React from "react";
import { Link } from "react-router-dom";
import { uuid } from "uuidv4";
import { createTask, getColumns, getTasks } from "~/model/task.server";
import { getUser, getUserId } from "~/model/user.server";

type task = {
  title: string | null;
  content: string;
  UserId: string;
  ColumnsId: string;
};

export const action: ActionFunction = async ({ params, request }) => {
  const { coulmnID } = params;
  const form = await request.formData();
  const title = form.get("title");
  const content = form.get("content");

  const newTask = {
    title: title,
    content: content,
    UserId: await getUserId(request),
    ColumnsId: params.id,
    //   User:await getUser(request),
    //   Coulmns:await getColumns()
  };
  await createTask(newTask);
  return redirect("..");
};

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
        <input
          type={"text"}
          required
          minLength={3}
          name="title"
          style={{ color: "black" }}
        />
        <label>content</label>
        <textarea
          required
          minLength={3}
          name="content"
          style={{ color: "black" }}
        />
        <button type="submit" className="button">
          Create task
        </button>
      </form>
    </div>
  );
};

export default $id;
