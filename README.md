# label to pull request action

Put label from your issues to the PR. If a PR is linked to 
at least one issue, all the label are added to the PR. 

## Options

| parameter | description  | default  |
|---|---|---|
| github-token  | Personal Access Token (PAT) that allows the stale workflow to authenticate and perform API calls to GitHub. Under the hood, it uses the @actions/github package.  | github.token  |
| clean-before-fetching  | remove all PR labels before updating PR  | false  |
| excluded-labels  | commat separated labels that are not applied to PR  |   |
