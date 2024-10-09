import { NextResponse } from "next/server";
import { headers } from 'next/headers'
import {readDataMany} from "@/lib/db";


export async function GET(request) {
    try {
        const header = headers()
        const { searchParams }= new URL(request.url);
        const task = searchParams.get('task') ?? "";
        const user = searchParams.get('user') ?? "";
        if (task === "") return NextResponse.json({msg: "send some shit"});
        let data = await readDataMany({
            "collection": 'milestones',
            query: {
                'task': parseInt(task),
            }
        })
        const completedMilestones = await readDataMany({
            "collection": "progress",
            query: {
                "username": user
            }
        })
        const lastCompletedMilestone = Math.max(...completedMilestones.map(milestone => milestone.identifier))
        data = data.map((milestone) => {
            delete milestone['_id'];
            milestone['status'] = milestone.identifier <= lastCompletedMilestone ? "Completed"
                : (milestone.identifier === lastCompletedMilestone + 1 ? "Waiting" : "Incomplete");
            return milestone;
        })
        return NextResponse.json({status: 200, data: data});
    } catch (err) {
        console.error(err); // Log the error for debugging
        return NextResponse.json({ success: false, message: 'Error: Internal Error', ErrorMsg: err?.toString() });
    }
}
