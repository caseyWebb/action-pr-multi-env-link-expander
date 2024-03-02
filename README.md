# Multi-Environment Link Expander GitHub Action

[![GitHub Super-Linter](https://github.com/caseyWebb/action-pr-multi-env-link-expander/actions/workflows/linter.yml/badge.svg)](https://github.com/super-linter/super-linter)
![CI](https://github.com/caseyWebb/action-pr-multi-env-link-expander/actions/workflows/ci.yml/badge.svg)
[![Check dist/](https://github.com/caseyWebb/action-pr-multi-env-link-expander/actions/workflows/check-dist.yml/badge.svg)](https://github.com/caseyWebb/action-pr-multi-env-link-expander/actions/workflows/check-dist.yml)
[![CodeQL](https://github.com/caseyWebb/action-pr-multi-env-link-expander/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/caseyWebb/action-pr-multi-env-link-expander/actions/workflows/codeql-analysis.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)

This action expands localhost links in a PR description for multiple
environments. For example, transforms

```markdown
http://localhost:3000/my/cool/page
```

to

```markdown
https://staging.myapp.com/my/cool/page (Open in
[Development](http://localhost:3000/my/cool/page))
```

---

Markdown links are also supported. For example,

```markdown
[My Cool Page](http://localhost:3000/my/cool/page)
```

is transformed to

```markdown
[My Cool Page (Staging)](https://staging.myapp.com/my/cool/page) (Open in
[Development](http://localhost:3000/my/cool/page))
```

---

If multiple environments are specified, the action will expand the links for
each.

```markdown
https://staging.myapp.com/my/cool/page (Open in
[Production](https://myapp.com/my/cool/page),
[Development](http://localhost:3000/my/cool/page))
```

## Usage

This action is designed to be used in a GitHub Actions workflow. To use this
action in your repository, create a new workflow file (e.g.,
`.github/workflows/expand-localhost-links.yml`) and add the following content:

```yaml
name: 'PR Multi-Environment Link Expander'
on:
  pull_request:
    types: [opened, edited]

permissions:
  pull-requests: write

jobs:
  expand-localhost-links:
    runs-on: ubuntu-latest
    steps:
      - name: Expand Localhost Links
        id: expand-localhost-links
        uses: caseyWebb/action-pr-multi-env-link-expander@v1.0.0
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ENVIRONMENTS:
            '{"Staging": "https://staging.myapp.com", "Production":
            "https://myapp.com"}'
```

### Configuration

The action requires the following inputs:

- `GITHUB_TOKEN`

  - The GitHub token used to authenticate with the GitHub API. This is
    automatically provided by GitHub Actions and does not need to be set
    manually.

- `ENVIRONMENTS`
  - A JSON object that maps environment names to their respective URLs. For
    example,
    `{"Staging": "https://staging.myapp.com", "Production": "https://myapp.com"}`.

## Contributing

### Setting Up Your Development Environment

This repository uses [Nix](https://nixos.org/) and [direnv](https://direnv.net/)
to manage the development environment. To get started, install Nix and direnv,
and then run the following command:

```bash
direnv allow
```

This will install the required dependencies and set up the development
environment, including installing the required npm dependencies.

### Running the Tests

```bash
$ npm test

PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)

...
```

Pass additional arguments to jest by adding them to the `npm test` command. For
example,

```bash
npm test -- --watch
```

### Publishing a New Release

This project includes a helper script, [`script/release`](./script/release)
designed to streamline the process of tagging and pushing new releases for
GitHub Actions.

GitHub Actions allows users to select a specific version of the action to use,
based on release tags. This script simplifies this process by performing the
following steps:

1. **Retrieving the latest release tag:** The script starts by fetching the most
   recent release tag by looking at the local data available in your repository.
1. **Prompting for a new release tag:** The user is then prompted to enter a new
   release tag. To assist with this, the script displays the latest release tag
   and provides a regular expression to validate the format of the new tag.
1. **Tagging the new release:** Once a valid new tag is entered, the script tags
   the new release.
1. **Pushing the new tag to the remote:** Finally, the script pushes the new tag
   to the remote repository. From here, you will need to create a new release in
   GitHub and users can easily reference the new tag in their workflows.
