import {getOctokit}  from "./octokit.js";

export function addLabels(pullRequestId, labelsIds) {
    getOctokit().graphql(
        `
mutation updateLabels($labelsIds: [ID!]!, $pullRequestId: ID!) {
  addLabelsToLabelable(input: {clientMutationId:"1", labelIds: $labelsIds, labelableId: $pullRequestId}) {
    __typename
  }
}
        `,
        {
            labelsIds: labelsIds,
            pullRequestId: pullRequestId
        }
    )
}
