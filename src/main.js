import {getIssues} from "./issues.js";
import {addLabels} from "./label.js";
import {clean} from "./clean.js";
import {filterLabel} from "./filterLabel.js";


async function run(number, name, owner) {

    const data = await getIssues({
        prNumber: number,
        repoName: name,
        repoOwner: owner.login,
    });

    const pullRequest = data.repository?.pullRequest || {};
    const labels = (pullRequest?.closingIssuesReferences?.nodes || []).map(function (issue) {
        return (issue?.labels?.nodes || []).map(label => ({ id: label.id, name: label.name}));
    })

    clean(pullRequest.id)
        .then(function () {
            addLabels(pullRequest.id, filterLabel([].concat(...labels)));
        });

}

export {run};
