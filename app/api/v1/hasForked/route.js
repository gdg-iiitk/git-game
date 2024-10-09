import { NextResponse } from "next/server";
import { readDataMany, readDataOne, writeData } from "@/lib/db";
import { headers } from "next/headers";

export async function fetchPublicRepos(username) {
  const url = `https://api.github.com/users/${encodeURIComponent(
    username
  )}/repos?type=public`;
  const token = process.env.GITHUB_TOKEN;
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

  const repos = await response.json();
  return repos.filter((repo) => repo.fork);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user") ?? "";
    const page = process.env.PAGE || new URL(request.url).hostname;
    const id = 2;
    if (user === "")
      return NextResponse.json({ msg: "send some shit" }, { status: 400 });
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
    const data = await fetchPublicRepos(user);
    const forkedRepo = data.filter((repo) => repo.homepage === page);
    if (forkedRepo.length === 1) {
      await writeData({
        collection: "progress",
        data: [
          {
            identifier: id,
            username: user,
            completedTime: forkedRepo[0].created_at,
          },
        ],
      });
    }
    const success = forkedRepo.length === 1;
    return NextResponse.json({
      status: 200,
      success: success,
      message: success ? "Ok" : "Not forked repo found on your profile",
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return NextResponse.json({
      success: false,
      message: "Error: Internal Error",
      ErrorMsg: err?.toString(),
    });
  }
}
