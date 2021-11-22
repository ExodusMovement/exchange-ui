# Linter Boilerplate

This repository is meant to be used as a Github template repo for creating miscellaneous NPM packages or even to bootstrap a monorepo.

It comes with `eslint` and `prettier` preconfigured according to standard Exodus configurations.

## Instructions

**1. Create a new repository.**

![Screenshot_2021-04-07_17-36-28](https://user-images.githubusercontent.com/31221309/113951183-e8813500-97c7-11eb-8edf-c80c33b98ac7.png)

**2. Select this repo as your template.**

![Screenshot_2021-04-07_17-40-50](https://user-images.githubusercontent.com/31221309/113951526-912f9480-97c8-11eb-9593-b1cdff2048ac.png)

**3. Customize the `package.json` file for your purposes.**

- Fix the package name from `@exodus/linter-boilerplate`. Generally, best practice is to mirror the new repo's name in the package name: `@exodus/<repo_name>`.
- Remove `"private": true` if this is a package you intend to publish to NPM.
- Add a description.
- Update the `repository`, `bugs`, and `homepage` URLs to point to your new repository instead of to `ExodusMovement/linter-boilerplate`.
- Specify the license if applicable.

**4. Overwrite this README file with your own documentation.**

**5. Start adding your own code!**
