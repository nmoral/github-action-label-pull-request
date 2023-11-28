const core = require('@actions/core');
const github = require('@actions/github');


function getOctokit() {
    const token = core.getInput("github-token");
    return github.getOctokit(token);
}


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
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)

    const {
        number,
        repository: { owner, name },
    } = payload;

    const data = await getIssues({
        prNumber: number,
        repoName: name,
        repoOwner: owner.login,
    });
    const repository = JSON.stringify(data.repository);
    console.log(`The pullRequest: ${repository}`);
} catch (error) {
    core.setFailed(error.message);
}
