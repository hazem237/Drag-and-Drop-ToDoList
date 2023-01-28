import { ActionFunction, json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { LoaderFunction } from "react-router";
import { deleteTask, getSingleColumn, getSingleTask } from "~/model/task.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const singleTask = await getSingleTask(params.id);
  const singleCoulmn = await getSingleColumn(singleTask?.ColumnsId);
  return json({
    title: singleTask?.title,
    content: singleTask?.content,
    coulmnTitle: singleCoulmn?.title,
    created: singleTask?.createdAt.toString().slice(0, 21),
    updated: singleTask?.updatedAt.toString().slice(0, 21),
  });
};
export const action: ActionFunction = async ({ request , params }) => {
  const form = await request.formData();
  const SubmitBtn = form.get("subBtn");
  if (SubmitBtn==='delete') {
    await deleteTask(params.id)
    return redirect('..')
  } else {
    console.log("Edit !!");
  }
  return null;
};
function getClassName(coulmnName: string): string {
  switch (coulmnName) {
    case "to Do":
      return "to-Do-container";
      break;
    case "in Progress":
      return "in-progress-container";
      break;
    default:
      return "Done-container";
  }
}
const $id = () => {
  const { title, content, coulmnTitle, created, updated } = useLoaderData();
  return (
    <div className="single-task-container">
      <div className="single-task-container-header">
        <Link to={".."} style={{ color: "black" }}>
          x
        </Link>
      </div>
      <div className="data-container">
        <h2>{title}</h2>
        <h5>
          Status:{" "}
          <span className={`${getClassName(coulmnTitle)}`}>{coulmnTitle}</span>
        </h5>
        <h5>Created at: {created}</h5>
        <h5>Last update: {updated}</h5>
        <h4>{content}</h4>
        <form className="single-task-form" method="post">
          <button className="button" name="subBtn" type="submit" value='delete'>
            Delete Task{" "}
          </button>
          <button className="button" name="subBtn" value='edit' type="submit">
            Edit Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default $id;
