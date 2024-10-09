import { NextResponse } from "next/server";
import { readDataMany, writeData } from "@/lib/db";

export async function fetchCommits(owner, repo) {
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

export async function fetchBranches(owner, repo) {
  const since = process.env.STARTING;
  const token = process.env.GITHUB_TOKEN;
  const url = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${repo}/branches`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${token}`,
    },
  });
  if (response.status === 404) return null;
  return await response.json();
}

export async function fetchFiles(owner, repo, branch) {
  const since = process.env.STARTING;
  const token = process.env.GITHUB_TOKEN;
  const url = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${repo}/contents/?ref=${branch}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `token ${token}`,
    },
  });
  if (response.status === 404) return null;
  return await response.json();
}

const fetchDetails = async (url) => {
  const since = process.env.STARTING;
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
  return await response.json();
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get("user") ?? "";
    const repo = `git-game`;
    // as repo name is fixed i.e. = git-game_<username> , we can construct it here using username
    // const repo = searchParams.get("repo") ?? "";
    const owner = searchParams.get("owner") ?? "";
    const branchName = `git-game_${user}`;
    const since = process.env.STARTING;

    //changed the urls
    const fileUrl = `https://api.github.com/repos/${encodeURIComponent(
      user
    )}/${encodeURIComponent(repo)}/contents/?ref=${branchName}`;
    // const fileUrl = `https://api.github.com/repos/${encodeURIComponent(
    //   owner
    // )}/${repo}/contents/?ref=${branchName}`;
    const commitUrl = `https://api.github.com/repos/${encodeURIComponent(
      user
    )}/${repo}/commits?since=${since}`;
    // const commitUrl = `https://api.github.com/repos/${encodeURIComponent(
    //   owner
    // )}/${repo}/commits?since=${since}`;

    const branchUrl = `https://api.github.com/repos/${encodeURIComponent(
      user
    )}/${encodeURIComponent(repo)}/branches`;
    // const branchUrl = `https://api.github.com/repos/${encodeURIComponent(
    //   owner
    // )}/${repo}/branches`;
    const id = 6;
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
        {
          status: 403,
          success: false,
          message: "Milestone already completed",
        },
        { status: 403 }
      );

    const branches = await fetchDetails(branchUrl);
    console.log(branches);
    const hasBranch = branches.some((branch) => branch.name === branchName);
    console.log(hasBranch);
    if (!hasBranch)
      return NextResponse.json({
        status: 200,
        success: false,
        branch: false,
        file: false,
        commit: false,
      });

    const files = await fetchDetails(fileUrl);

    const hasFile = files.some((file) => file.name.startsWith(user));
    if (!hasFile)
      return NextResponse.json({
        status: 200,
        success: false,
        branch: true,
        file: false,
        commit: false,
      });

    let commits = await fetchDetails(commitUrl);
    console.log(commits);
    commits = commits
      .filter((commit) => commit.author && commit.author.login)
      .sort((a, b) => new Date(a.author.date) - new Date(b.author.date));
    const hasCommit = commits.length > 0;
    if (!hasCommit)
      return NextResponse.json({
        status: 200,
        success: false,
        branch: true,
        file: true,
        commit: false,
      });

    //Commented this out so i don't write to db while testing
    await writeData({
      collection: "progress",
      data: [
        {
          identifier: id - 2,
          username: user,
          completedTime: commits[0].commit.author.date,
        },
        {
          identifier: id - 1,
          username: user,
          completedTime: commits[0].commit.author.date,
        },
        {
          identifier: id,
          username: user,
          completedTime: commits[0].commit.author.date,
        },
      ],
    });
    return NextResponse.json({
      status: 200,
      success: true,
      branch: true,
      file: true,
      commit: true,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Error: Internal Error",
      branches: err.message,
    });
  }
}
