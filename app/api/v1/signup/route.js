import { NextResponse } from "next/server";
import {readDataOne, writeData } from "@/lib/db";
import { v4 as uuid } from 'uuid';
import { sql } from "@vercel/postgres";


export async function POST(request) {
    try {
        const body= await request.json()
        if (!(body.username && body.email && body.name)) {
            return NextResponse.json({status: 400, message: "Required Fields are missing"});
        }

        const username = body.username;
        const url = `https://api.github.com/users/${encodeURIComponent(username)}`;
        const token = process.env.GITHUB_TOKEN;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': `token ${token}`,
            },
        });
        if (!response.ok) {
            return NextResponse.json({status: 404, success: false, message: "User not found"});
        }
        const data = await readDataOne({
            'collection': 'users',
            query: {
                'username': body.username,
            }
        })
        if (data != null) {
            return NextResponse.json({status: 200, success: true, identifier: data.identifier});
        }
        const user = await writeData({
            'collection': 'users',
            data: [
                {
                    'username': body.username,
                    'email': body.email,
                    'name': body.name,
                }
            ]
        })
        return NextResponse.json({status: 200, success: true, data: user});
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Error: Internal Error', 'ErrorMsg': err.toString() });
    }
}