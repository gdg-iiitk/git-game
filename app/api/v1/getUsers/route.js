import { NextResponse } from "next/server";
import { headers } from 'next/headers'
import {readDataMany} from "@/lib/db";


export async function GET(request) {
    try {
        let data = await readDataMany({
            "collection": 'users',
            query: {
            }
        })
        return NextResponse.json({status: 200, attempters: data.length, data: data});
    } catch (err) {
        console.error(err); // Log the error for debugging
        return NextResponse.json({ success: false, message: 'Error: Internal Error', ErrorMsg: err?.toString() });
    }
}
