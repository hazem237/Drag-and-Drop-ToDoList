import { json, LinksFunction, LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { getColumn, getTasks, getToDoTasks } from "~/model/task.server";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { getUser, getUserId } from "~/model/user.server";
import stylesUrl from "~/styles/task.css";
import Header from "~/components/Header";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type loaderData = {
  tasksListItems: Awaited<ReturnType<typeof getTasks>>;
  columns: Awaited<ReturnType<typeof getColumn>>;
  user: Awaited<ReturnType<typeof getUser>>;
};
type columnData={
    id:string;
    title:string
    tasks:Awaited<ReturnType<typeof getTasks>>;
}| {
    id:string;
    title:string
}
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

  const onDragEnd = (result, columns, setColumns: Function) => {
    //console.log(columns)
    //console.log(columnsDtata)

   // console.log(result.destination);
    //console.log(result.source);

    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      console.log("1");
      const sourceColumn = columns[source.droppableId];
      // console.log("source",sourceColumn)
      const destColumn = columns[destination.droppableId];
      //console.log("dest",destColumn)
      const sourceItems = tasksListItems.filter(
        (task) => task.ColumnsId == sourceColumn.id
      );
     // console.log(sourceItems);
      const desttasks = tasksListItems.filter(
        (task) => task.ColumnsId == destColumn.id
      );
    //  console.log(desttasks);
      const [removed] = sourceItems.splice(source.index, 1);
      //console.log(removed)
      desttasks.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: desttasks,
        },
      });
     // console.log("columns", columnsDtata);
    } else {
      console.log("2");
         const column = columns[source.droppableId];
         const copiedtasks = tasksListItems.filter(
            (task) => task.ColumnsId == column.id
          );
        const [removed] = copiedtasks.splice(source.index, 1);
        copiedtasks.splice(destination.index, 0, removed);
        setColumns({
          ...columns,
           [source.droppableId]: {
            ...column,
            tasks: copiedtasks
          }
        });
    }
  };

  const [columnsDtata, setColumnsDtat] = useState<columnData[]>(columns);
  columns.map((col)=>{
    const tasks = tasksListItems.filter((task)=>task.ColumnsId==col.id)
    col.tasks=tasks
})
 

   console.log(columnsDtata)
  return (
    <div className="task-layout">
      <Header username={user?.username} />
      {winReady && (
        <main className="tasks-main">
          <DragDropContext
            onDragEnd={(result) =>
              onDragEnd(result, columnsDtata, setColumnsDtat)
            }
          >
            {Object.entries(columnsDtata).map(([columnId, column], index) => {
              return (
                <Droppable key={columnId} droppableId={columnId}>
                  {(provided, snapshot) => {
                    //   console.log("test1", provided.droppableProps);
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
                        {column.tasks.map((task, index) => {
                          return (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided) => {
                                //   console.log("test2", provided.draggableProps);
                                //   console.log("test3", provided.dragHandleProps);
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
        </main>
      )}
    </div>
  );
}
