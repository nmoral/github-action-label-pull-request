import {getOctokit}  from "./octokit.js";

export function getIssues({ prNumber, repoOwner, repoName }) {
    return getOctokit().graphql(
        `
    query getLinkedIssues($owner: String!, $name: String!, $number: Int!) {
      repository(owner: $owner, name: $name) {
        pullRequest(number: $number) {
          id
          closingIssuesReferences(first: 100) {
            totalCount
            nodes {
              labels(first: 10) {
                nodes {
                  id
                }
              }
              repository {
                nameWithOwner
              }
            }
          }
        }
      }
    }
    `,
        {
            owner: repoOwner,
            name: repoName,
            number: prNumber,
        }
    );
}
