import { PrismaClient } from "@prisma/client";
import { json, LinksFunction, LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
// import { json, LoaderFunction, useLoaderData } from "react-router";
import { getColumn, getTasks, getToDoTasks } from "~/model/task.server";
import { NoSSR } from "react-no-ssr";
import {
  DragDropContext,
  Draggable,
  Droppable,
  resetServerContext,
} from "react-beautiful-dnd";
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
  const { tasksListItems, columns, user } = useLoaderData() as loaderData;
  const arr = [1, 2, 3, 4, 5];
  const [winReady, setwinReady] = useState(false);
  useEffect(() => {
    setwinReady(true);
  }, []);

  return (
    <div className="task-layout">
      <Header username={user?.username} />
      {winReady && <main className="tasks-main">
        <DragDropContext onDragEnd={(r) => console.log(r)}>
          {Object.entries(columns).map(([columnId, column], index) => {
            console.log(columnId, column);
            return (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided, snapshot) => {
                  console.log("test1", provided.droppableProps);
                  const tasks = tasksListItems.filter(
                    (task) => task.ColumnsId === column.id
                  );
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="main-child"
                    >
                      <h3>{column.title}</h3>
                      {tasks.map((task, index) => {
                        return (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                            
                          >
                            {(provided) => {
                              console.log("test2", provided.draggableProps);
                              console.log("test3", provided.dragHandleProps);
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
                                  className="single-task"
                                >
                                  {task.title}
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                    </div>
                  );
                }}
              </Droppable>
            );
          })}
        </DragDropContext>
      </main>}
    </div>
  );
}
