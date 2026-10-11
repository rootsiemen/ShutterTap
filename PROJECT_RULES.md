# ShutterTap — Project Rules (permanent constraints)

These rules outrank convenience. Every agent and contributor follows them.

## 1. Safety

1. Never modify, rename, delete, move, or reformat anything inside
   `/Users/ombadgujar/Development/EarShot`. It is a read-only
   reference. Listing (`ls`) and reading files is allowed; everything
   else is forbidden.
2. Do not perform Git operations of any kind: no init, branch,
   commit, push, pull, reset, checkout, rebase, stash, or history
   edits. The owner handles Git/GitHub manually.
3. Do not replace the project with a newly generated application.
4. Do not migrate to Flutter. Do not convert to Expo Go (custom native
   code requires development builds).
5. If an action is destructive, irreversible, expensive, or may affect
   files outside the project (e.g. `expo prebuild --clean`, wiping
   simulators, deleting DerivedData/Pods/lockfiles, global installs),
   stop and explain the risk first. Back up or record exactly what
   will change before proceeding.
6. Never expose API keys, tokens, passwords, certificates, or secrets
   in documentation or logs.
7. Do not install global packages or change system-wide settings
   without establishing necessity.

## 2. Preservation

8. Preserve existing functionality. Do not delete native modules,
   dependencies, screens, navigation, or features without proving
   they are unnecessary and checking consequences.
9. Do not remove working native functionality just to make a build pass.
10. Prefer small, understandable, reversible changes over large
    speculative rewrites. No full-UI redesign as part of stabilization
    unless a UI defect blocks functionality or testing.
11. Do not modify `node_modules` permanently as a substitute for fixing
    project config/dependencies.

## 3. Dependencies

12. Do not blindly upgrade every dependency to latest, and do not
    blindly downgrade React Native, Expo, Node, or majors. Use the
    repo's package manager (npm + `package-lock.json`) only; do not
    mix npm/Yarn/pnpm. Do not regenerate the lockfile unnecessarily.
13. Compatibility trio is pinned by evidence: expo ~57.0.27 target,
    react-native 0.86.3, react 19.2.3. Change only with official
    compatibility evidence or build-log proof, minimally and with a
    recorded reason.
14. Do not add arbitrary linker flags, disable security protections
    (e.g. script sandboxing, receiver export flags), suppress errors,
    or add compatibility hacks without establishing the root cause.
    The 16 KB page-size work must identify offending libraries via
    packaged artifacts first (see TODO ST-P2-04); never blindly add
    `-Wl,--page-size=16384` to an arbitrary target.

## 4. Verification and honesty

15. Do not claim something works unless verified by an appropriate
    test or command. Record exact command, exit status, result, and
    limitations for every check.
16. Never mark hardware-dependent testing complete when the hardware
    is unavailable. Distinguish UI / bridge / emulator / physical /
    hardware-specific verification explicitly.
17. Never mark a task complete merely because code changed; acceptance
    criteria + tests govern. Use TODO statuses consistently:
    `[ ]` not started, `[~]` in progress, `[x]` verified complete,
    `[BLOCKED]` with a documented blocker.
18. Do not ask the owner questions answerable by inspecting the repo,
    configs, installed tools, logs, or available devices.
19. Do not create fake TODO items, and do not remove known problems
    from documentation because they are hard.
20. If a problem cannot be resolved safely, document evidence,
    blocker, and exact next step instead of pretending it is fixed.
21. Prioritize root-cause fixes over cosmetic suppression. If a fix
    causes a regression, investigate the regression rather than
    layering workarounds. Do not loop expensive full builds when a
    targeted test detects the same problem.

## 5. Documentation

22. `AGENTS.md` is the main agent entry point and references the other
    docs. `ARCHITECTURE.md` describes the real repo (verified only).
    `TESTING.md` holds repeatable test instructions. `TODO.md` is the
    actionable backlog; `PROGRESS.md` is the running log.
23. Update TODO.md and PROGRESS.md for every issue/fix cycle
    (reproduce → error → location → root cause → fix → narrow test →
    regression test → diff review → doc update).
24. Documentation must match the actual repository. Never claim a
    directory, dependency, screen, or feature exists without verifying it.
