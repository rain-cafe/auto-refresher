### 🤖 Contributing to Refreshly 💗

See an [issue](/issues) or need that you're able to fulfill?
Then this is the perfect place for you!

## Prerequisites

- NodeJS 18

## Setting Up Locally

- Install the Dependencies

```sh
$ yarn
```

## Run the tests~

```sh
$ yarn test
```

## Manually testing locally

- Create a `.env` file

```properties
# For GitLab.Source & GitLab.Target
GITLAB_TOKEN=glpat-A6_D157s9cnYzFaZx5ec

# For GitHub.Target
GH_TOKEN=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

# For AWS.Source
AWS_ACCESS_KEY_ID=<aws-access-key>
AWS_SECRET_ACCESS_KEY=<aws-secret-access-key>
```

- In one terminal start the watch script

```sh
# This will recompile the modules anytime the code changes
$ yarn watch
```

- In another terminal start the demo

```sh
# This runs the demo only once
$ yarn start
```
