import { Endpoints } from "@octokit/types";

export type LatestCommits = Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"];