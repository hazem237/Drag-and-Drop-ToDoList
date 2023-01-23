import { PrismaClient } from "@prisma/client";
import { LinksFunction, LoaderArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import React from "react";
import { json, LoaderFunction, useLoaderData } from "react-router";
import { getColumn, getTasks, getToDoTasks } from "~/model/task.server";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { getUser, getUserId } from "~/model/user.server";
import stylesUrl from "~/styles/task.css";
import Header from "~/components/header";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type loaderData = {
  tasksListItems: Awaited<ReturnType<typeof getTasks>>;
  columns: Awaited<ReturnType<typeof getColumn>>;
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader = async ({ request }: LoaderArgs) => {
  const tasksListItems = await getTasks(request);
  const columns = await getColumn();
  const user = await getUser(request);
  return json<loaderData>({
    tasksListItems,
    user,
    columns,
  });
};

export default function tasks() {
  const data = useLoaderData() as loaderData;
  const arr = [1, 2, 3, 4, 5];
  return (
    <div className="task-layout">
      <Header username={data.user?.username} />
      <main className="tasks-main">
        {data.columns.map((c) => {
          const tasks = data.tasksListItems.filter(
            (task) => task.ColumnsId === c.id
          );
          return (
            <div className="main-child" key={c.id}>
              <h2>{c.title}</h2>
              {tasks.map((t) => {
                return <div className="single-task" key={t.id}>{t.title}</div>;
              })}
            </div>
          );
        })}
      </main>
    </div>
  );
}
