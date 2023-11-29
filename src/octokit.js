import core from "@actions/core";
import github from "@actions/github";

export function getOctokit() {
    const token = core.getInput("github-token");
    return github.getOctokit(token);
}
