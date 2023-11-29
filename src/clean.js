import core from "@actions/core";
import {getOctokit} from "./octokit.js";


export function clean(pullRequestId) {
    const clean = !!core.getInput("clean-before-fetching");
    if (!clean) {
        return new Promise(() => {});
    }

    return getOctokit().graphql(
        `
mutation clearLabels($pullRequestId: ID!) {
  clearLabelsFromLabelable(input: {clientMutationId:"2", labelableId: $pullRequestId}) {
    __typename
  }
}
        `,
        {
            pullRequestId: pullRequestId
        }
    )
}
