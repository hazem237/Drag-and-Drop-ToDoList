import { PrismaClient } from '@prisma/client'
import { LoaderArgs } from '@remix-run/node'
import { Link } from '@remix-run/react'
import React from 'react'
import { json, LoaderFunction, useLoaderData } from 'react-router'
import { getTasks } from '~/model/task.server'
import { getUser, getUserId } from '~/model/user.server'
export  const loader = async({request}:LoaderArgs)=>{
    const db = new PrismaClient()
    console.log('user' , await getUserId(request))
    const tasksListItems = await getTasks(request)
    const user = await getUser(request);
  
    return json({
      tasksListItems,
      user,
    });
}
export default function tasks(){
    const data = useLoaderData();
    return (
        <div>
           <form action="/logout" method="post">
                <button type="submit" className="button">
                  Logout
                </button>
              </form>
           <div>
            {data.user.username}
           </div>
        </div>
    )
}