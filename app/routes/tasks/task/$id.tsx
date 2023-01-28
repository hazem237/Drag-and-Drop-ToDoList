import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React from "react";
import { LoaderFunction } from "react-router";
import { getSingleColumn, getSingleTask } from "~/model/task.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const singleTask = await getSingleTask(params.id);
  const singleCoulmn = await getSingleColumn(singleTask?.ColumnsId);
  console.log(singleTask);
  console.log(singleCoulmn?.title);
  return json({
    title: singleTask?.title,
    content: singleTask?.content,
    coulmnTitle: singleCoulmn?.title,
  });
};
const $id = () => {
  const { title, content, coulmnTitle } = useLoaderData();
  return (
    <div className="single-task-container">
      <div className="single-task-container-header">
        <Link to={".."}>X</Link>
      </div>
      <h2>
        {title}
      </h2>
      <h4>
        {coulmnTitle}
      </h4>
      <h3>
        {content}
      </h3>
    </div>
  );
};

export default $id;
