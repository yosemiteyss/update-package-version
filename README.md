# update-package-action

An GitHub Action to update package.json version.

### Inputs

- `release_tag`: Release tag, format must be vX.X.X
- `commit_lock_file` (Optional): Whether to commit package-lock.json or not
- `commit_user_email` (Optional): Email address for git commit
- `commit_user_name` (Optional): Username for git commit
- `commit_message` (Optional): Commit message, followed by version
- `commit_tag_prefix` (Optional): Commit tag prefix, followed by version

### Workflow

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4

  - name: Update Package Version
    id: update-package-version
    uses: yosemiteyss/update-package-version@v1
    with:
      release_tag: ${{ github.event.release.tag_name }}
      commit_lock_file: true
      commit_tag_prefix: 'prod_release_'
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN}}
```
