import { PrismaClient } from "@prisma/client";
import { LinksFunction, LoaderArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import React from "react";
import { json, LoaderFunction, useLoaderData } from "react-router";
import { getColumn, getTasks, getToDoTasks } from "~/model/task.server";
import { getUser, getUserId } from "~/model/user.server";
import stylesUrl from "~/styles/task.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader = async ({ request }: LoaderArgs) => {
  console.log("user", await getUserId(request));
  const tasksListItems = await getTasks(request);
  const user = await getUser(request);
  const columns = await getColumn();
  const toDo = await getToDoTasks(request);

  return json({
    tasksListItems,
    user,
    toDo,
  });
};
export default function tasks() {
  const data = useLoaderData();
  return (
    <div className="task-layout">
      <header>
        <h2>
          <Link to="/tasks">
            <span className="title">Swapy</span>
          </Link>
        </h2>
        <div className="welcome">
          <span className="Hi">{`Hi ${data.user.username}`}</span>
          <form action="/logout" method="post" className="logout-form">
            <button type="submit" className="button">
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="tasks-main">
        <div className="main-child">
          <h2>to Do</h2>
          {data.toDo.map((t) => (
            <div className="single-task">{t.title}</div>
          ))}
        </div>
        <div className="main-child">
          <h2>Doing</h2>
          {data.toDo.map((t) => (
            <div className="single-task">{t.title}</div>
          ))}
        </div>
        <div className="main-child">
          <h2>Done</h2>
          {data.toDo.map((t) => (
            <div className="single-task">{t.title}</div>
          ))}
        </div>
      </main>
    </div>
  );
}
