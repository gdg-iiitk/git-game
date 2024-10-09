import { NextResponse } from "next/server";

export async function fetchCommits(owner, repo) {
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
  return await response.json();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user") ?? "";
    const repo = searchParams.get("repo") ?? "";
    const owner = searchParams.get("owner") ?? "";
    if (user === "" || repo === "")
      return NextResponse.json({ msg: "send some shit" });
    const data = await fetchCommits(owner, repo);
    if (data.length < 1)
      return NextResponse.json({ status: 200, success: false });
    return NextResponse.json({
      status: 200,
      success: data.some((repo) => repo.author.login === user),
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
