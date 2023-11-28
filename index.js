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
              number
              labels(first: 10) {
                nodes {
                  id,
                  name
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

try {
    // Get the JSON webhook payload for the event that triggered the workflow
    const token = core.getInput("github-token");
    console.log(`The pullRequest: ${token}`);
    const {
        number,
        repository: { owner, name },
    } = github.context.payload;

    const data = getIssues({
        prNumber: number,
        repoName: name,
        repoOwner: owner.login,
    }).then(function (data) {
        data = JSON.stringify(data);
        console.log(`The pullRequest: ${data}`);
    });
    const repository = JSON.stringify(data);
    console.log(`The pullRequest: ${repository}`);
} catch (error) {
    core.setFailed(error.message);
}
