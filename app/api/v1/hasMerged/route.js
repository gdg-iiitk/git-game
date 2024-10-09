import { NextResponse } from "next/server";
import { readDataMany, writeData } from "@/lib/db";

export async function fetchMerges(owner, repo) {
  const since = process.env.STARTING;
  const token = process.env.GITHUB_TOKEN;
  const url = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${repo}/commits?since=${since}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(
      `GitHub API responded with status ${response.status}: ${response.statusText}`
    );
  }
  const commits = await response.json();
  return commits.filter((commit) => commit.parents.length > 1);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user") ?? "";
    const repo = searchParams.get("repo") ?? "";
    const id = 8;
    if (user === "" || repo === "")
      return NextResponse.json({ msg: "send some shit" });

    const progress = await readDataMany({
      collection: "progress",
      query: {
        username: user,
        identifier: { $eq: id },
      },
    });
    if (progress.length > 0)
      return NextResponse.json(
        { status: 403, success: false, message: "Milestone already completed" },
        { status: 403 }
      );
    const data = await fetchMerges(user, repo);

    const merges = data.filter((merge) => {
      let d1 = new Date(merge.commit.author.date ?? "");
      let d2 = new Date(process.env.STARTING);
      return d1 > d2;
    });
    const success = merges.length > 0;
    if (success) {
      await writeData({
        collection: "progress",
        data: [
          {
            identifier: id,
            username: user,
            completedTime: merges[0].commit.author.date,
          },
        ],
      });
    }
    return NextResponse.json(
      {
        status: 200,
        success: success,
        message: success ? "Ok" : "No Merge found",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err); // Log the error for debugging
    return NextResponse.json({
      success: false,
      message: "Error: Internal Error",
      ErrorMsg: err?.toString(),
    });
  }
}
