# update-package-action

An GitHub Action to update package version.

### Inputs

- `runtime`: Specify the runtime, values: `node`, `dart`, `flutter`
- `release_tag`: Release tag, format must be vX.X.X
- `commit_user_email` (Optional): Email address for git commit
- `commit_user_name` (Optional): Username for git commit
- `commit_message` (Optional): Commit message, followed by version

### Workflow

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Update Package Version
    id: update-package-version
    uses: yosemiteyss/update-package-version@v1.0.2
    with:
      runtime: node
      release_tag: ${{ github.event.release.tag_name }}
    env:
      WRITE_REPO_PAT: ${{ secrets.GITHUB_TOKEN }}
```
