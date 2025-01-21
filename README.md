# update-package-action

An GitHub Action to update package.json version.

### Inputs

- `release_tag`: Release tag, format must be vX.X.X
- `commit_lock_file` (Optional): Whether to commit package-lock.json
- `commit_user_email` (Optional): Email address for git commit
- `commit_user_name` (Optional): Username for git commit
- `commit_message` (Optional): Commit message, followed by version

### Workflow

```yaml
steps:
  - name: Checkout
    id: checkout
    uses: actions/checkout@v4
    with:
      ref: ${{ github.ref }}

  - name: Update Package Version
    id: update-package-version
    uses: yosemiteyss/update-package-version@v1.0.0
    with:
      release_tag: ${{ github.event.release.tag_name }}
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
