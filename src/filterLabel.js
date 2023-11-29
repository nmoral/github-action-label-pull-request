import core from "@actions/core";


export function filterLabel() {
    core.getInput("github-token")
}
