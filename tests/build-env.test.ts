import { describe, expect, it } from "vitest";
import { checkBuildEnvironment } from "@/lib/build-env";

describe("production build environment guard", () => {
  it("refuses main without DEPLOYMENT_ENV=production", () => {
    // The failure this exists to prevent: a deploy that succeeds, renders
    // correctly, and is invisible to search.
    const errors = checkBuildEnvironment({ branch: "main" });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.join(" ")).toMatch(/noindex/);
  });

  it("refuses main with a wrong or near-miss value", () => {
    for (const value of ["development", "preview", "Production", "prod", ""]) {
      expect(
        checkBuildEnvironment({ branch: "main", deploymentEnv: value }),
        `"${value}" should be refused`,
      ).not.toEqual([]);
    }
  });

  it("permits main with the exact production value", () => {
    expect(
      checkBuildEnvironment({ branch: "main", deploymentEnv: "production" }),
    ).toEqual([]);
  });

  it("leaves every other branch alone", () => {
    // Development is SUPPOSED to be noindex. Constraining it would break the
    // environment the guard is not about.
    for (const branch of ["development", "feature/x"]) {
      expect(
        checkBuildEnvironment({ branch, deploymentEnv: "development" }),
      ).toEqual([]);
      expect(checkBuildEnvironment({ branch })).toEqual([]);
    }
  });

  it("leaves non-Amplify builds alone", () => {
    // `pnpm build` on a laptop, and GitHub Actions, set no AWS_BRANCH.
    // Failing there would break every other use of this repo to protect one.
    expect(checkBuildEnvironment({})).toEqual([]);
    expect(checkBuildEnvironment({ deploymentEnv: "development" })).toEqual([]);
  });

  it("ignores surrounding whitespace, which a console field can easily carry", () => {
    expect(
      checkBuildEnvironment({
        branch: " main ",
        deploymentEnv: " production ",
      }),
    ).toEqual([]);
    expect(checkBuildEnvironment({ branch: " main " })).not.toEqual([]);
  });
});
