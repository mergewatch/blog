import { checkBuildEnvironment } from "../lib/build-env";

const errors = checkBuildEnvironment({
  branch: process.env.AWS_BRANCH,
  deploymentEnv: process.env.DEPLOYMENT_ENV,
});

if (errors.length) {
  console.error("Build environment check failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  process.env.AWS_BRANCH
    ? `Build environment OK (branch=${process.env.AWS_BRANCH}, DEPLOYMENT_ENV=${process.env.DEPLOYMENT_ENV ?? "unset"}).`
    : "Build environment OK (not an Amplify branch build).",
);
