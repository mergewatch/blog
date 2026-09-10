/**
 * Guard the one setting that decides whether production is visible.
 *
 * `DEPLOYMENT_ENV=production` is the single switch that permits indexing and
 * excludes drafts. Every other value — unset, misspelled, `preview` — fails
 * closed to `noindex, nofollow` and a blocking robots.txt.
 *
 * Failing closed is the right direction, but it fails SILENTLY: the site
 * builds, deploys, renders correctly, and is invisible to search. The only
 * symptom is traffic that never arrives, and the cause is a missing string in
 * a hosting console.
 *
 * The variable lives only in Amplify branch configuration, so nothing in this
 * repository can see it go missing. This makes the production build refuse
 * rather than ship an unindexable site.
 */

export const PRODUCTION_BRANCH = "main";

export interface BuildEnvInput {
  /** Amplify sets `AWS_BRANCH` on every build. Absent outside Amplify. */
  branch?: string;
  deploymentEnv?: string;
}

/**
 * Returns the reasons this build must not proceed, or an empty array.
 *
 * Only the production branch is constrained. A build with no branch — local,
 * GitHub Actions, `pnpm build` on a laptop — is not an Amplify production
 * build and is left alone; constraining it would break every other use of
 * this repo to protect one.
 */
export function checkBuildEnvironment(input: BuildEnvInput): string[] {
  const branch = input.branch?.trim();
  const deploymentEnv = input.deploymentEnv?.trim();

  if (branch !== PRODUCTION_BRANCH) return [];
  if (deploymentEnv === "production") return [];

  return [
    `Branch "${PRODUCTION_BRANCH}" must build with DEPLOYMENT_ENV=production, ` +
      `got ${deploymentEnv ? `"${deploymentEnv}"` : "no value"}.`,
    "Without it this build emits noindex, nofollow and a blocking robots.txt — " +
      "the site would deploy successfully and be invisible to search.",
    "Set DEPLOYMENT_ENV=production on the main branch in the Amplify console.",
  ];
}
