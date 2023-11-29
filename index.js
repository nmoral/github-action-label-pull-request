const core = require('@actions/core');
const github = require('@actions/github');


function getOctokit() {
    const token = core.getInput("github-token");
    return github.getOctokit(token);
}


function getIssues({ prNumber, repoOwner, repoName }) {
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

function addLabels(pullRequestId, labelsIds) {
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

try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const {
        number,
        repository: { owner, name },
    } = github.context.payload;

    getIssues({
        prNumber: number,
        repoName: name,
        repoOwner: owner.login,
    }).then(function (data) {
        const pullRequest = data.repository?.pullRequest || {};
        const labels = (pullRequest?.closingIssuesReferences?.nodes || []).map(function (issue) {
            return (issue?.labels?.nodes || []).map(label => label.id);
        })

        return {
            pullRequest: pullRequest.id,
            labels: ([]).concat(...labels),
        }
    }).then(function (data) {
        addLabels(data.pullRequest, data.labels);
    });
} catch (error) {
    core.setFailed(error.message);
}
