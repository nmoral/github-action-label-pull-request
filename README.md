# label to pull request action

Put label from your issues to the PR. If a PR is linked to 
at least one issue, all the label are added to the PR. 

## Options

### token
Personal Access Token (PAT) that allows the stale workflow to authenticate and perform API calls to GitHub.
Under the hood, it uses the @actions/github package.

Default value: ${{ github.token }}

### clean label on update

remove all the label in the PR before adding those from issues

Default value : false
