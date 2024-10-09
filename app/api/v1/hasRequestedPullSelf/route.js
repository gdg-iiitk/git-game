import {NextResponse} from "next/server";
import {readDataMany, writeData} from "@/lib/db";

export async function fetchPulls(owner, repo) {
    const since = process.env.STARTING;
    const token = process.env.GITHUB_TOKEN;
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${repo}/pulls?state=all&sort=created&direction=desc`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error(`GitHub API responded with status ${response.status}: ${response.statusText}`);
    }
    return await response.json()
}
export async function GET(request) {
    try {
        const {searchParams} = new URL(request.url);
        const repo = searchParams.get('repo') ?? "";
        const user = searchParams.get('user') ?? "";
        const id = 7;
        if (user === "" || repo === "") return NextResponse.json({msg: "send some shit"});
        const progress = await readDataMany({
            'collection': 'progress',
            query: {
                username: user,
                identifier: { $eq : id }
            }
        })
        if (progress.length > 0) return NextResponse.json({status: 403, success: false, message: "Milestone already completed"}, {status: 403});


        let pulls = await fetchPulls(user, repo);
        pulls = pulls.filter(pull => {
            let d1 = new Date(pull.created_at ?? "");
            let d2 = new Date(process.env.STARTING)
            return d1 > d2 && pull.user.login === user;
        });
        const success = pulls.length > 0;
        if (success) {
            await writeData({
                collection: 'progress',
                data: [{
                    identifier: id,
                    username: user,
                    completedTime: pulls[0].created_at
                }]

            })
        }
        return NextResponse.json({status: 200, success: success});
    } catch (err) {
        console.error(err);
        return NextResponse.json({success: false, message: 'Error: Internal Error', ErrorMsg: err?.toString()});
    }
}