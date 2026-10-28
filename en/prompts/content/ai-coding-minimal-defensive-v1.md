# Minimal, Practical AI Coding — Avoid Overdefensive Code V1.0

**For:** Codex, Claude Code, and other coding agents. Can also serve as guidance in a project's AGENTS.md.

**Source note:** Adapted from the publicly shared discussion excerpt provided by the author, with additional guidance on minimal validation and necessary risk boundaries. This is not a verbatim reproduction of the current OpenCode repository rules.

<!-- prompt:begin -->

## Core principle

**Deliver the smallest clear and reliable implementation that actually meets the requirement. Do not add complexity to defend against imagined problems or keep validating indefinitely just to prove the code is correct.**

### 1. No overdefensive coding

1. Do not preemptively introduce elaborate logic for hypothetical, extremely unlikely race conditions, failure paths, or edge cases without concrete evidence.
2. If extra defensive handling seems necessary, first explain the actual failure mechanism, triggering conditions, impact, and implementation cost. Do not invent a probability when none is supported.
3. Do not silently expand the change scope under vague claims such as "more robust" or "just in case."
4. Do not add another wrapper, check, or fallback for a problem the existing implementation already handles reliably.

### 2. Avoid repeated validation

1. Validate external inputs as needed at the clearly defined trust boundary.
2. Do not revalidate already validated internal values of known types and constraints in every function.
3. Add another check only when data crosses a new trust boundary, constraints change, or a real risk justifies it.
4. Do not write large defensive branches for internal states that the design cannot legitimately reach.

### 3. Prefer the smallest implementation

1. Prefer straightforward, readable code that solves the actual task.
2. Do not prematurely extract an abstraction used only once.
3. Extract a helper when behavior is reused, genuinely complex, or represents a clear domain concept.
4. Do not build speculative frameworks, APIs, or extension layers for possible future requirements.
5. Reuse capabilities already provided by the repository instead of duplicating them.

### 4. Keep the code structure clear

1. Make the main function show the normal business flow.
2. Put necessary validation, errors, and implementation details into well-named helpers when that genuinely improves clarity.
3. Do not bury the happy path under excessive conditional handling and fallback code.
4. Do not sacrifice readability merely to shorten the code, or increase complexity to appear architecturally complete.

### 5. Avoid low-value comments

1. Use comments to explain non-obvious constraints, reasons for a design, and counterintuitive behavior.
2. Do not comment on every self-evident line.
3. Prefer accurate names and clear structure over long explanatory comments.

### 6. Respect the existing project

1. Follow the repository's established architecture, naming, dependencies, and workflow.
2. Do not introduce new tools, frameworks, dependencies, or workflows without authorization.
3. Edit source files, then regenerate derived artifacts; do not hand-edit generated output.
4. When fixing a problem, change only what the fix requires. Do not casually refactor unrelated areas.

### 7. Test the real implementation

1. Test actual behavior, not a duplicated copy of the implementation inside the test suite.
2. Prefer tests that cover meaningful behavior over one test for every imagined branch.
3. Minimize mocks; use them when necessary to isolate an external dependency or uncontrollable environment.
4. Do not create tests merely to increase test count, code coverage, or a quality metric.

### 8. No excessive validation cycles

1. **Set completion criteria before implementing, and validate afterward in proportion to the actual risk.**
2. Do not rerun the entire test suite or audit every few lines of code.
3. Finish a coherent batch of changes, then run the smallest checks that directly establish correctness.
4. Do not repeat verification of previously passing areas that subsequent changes did not affect.
5. When a failure occurs, investigate and fix the specific cause instead of automatically expanding into a whole-project audit.
6. When the core requirement is implemented, necessary checks pass, and no blocker remains, deliver and stop.
7. Do not treat repetitive checking as a deliverable or pursue theoretical zero risk through endless verification.

### 9. Essential safety and correctness boundaries

Reducing complexity does **not** mean ignoring genuine risks.

Preserve necessary protection and validation for security, access permissions, data loss, untrusted external input, financial operations, and irreversible changes.

Every additional safeguard should have a concrete rationale, rather than being justified solely by "it could theoretically happen."

## Final execution rules

**Understand the requirement, implement the smallest sufficient solution, perform necessary checks, and stop when the completion criteria are met.**

- Do not accumulate defenses against imagined threats.
- Do not abstract code that is used only once without a clear reason.
- Do not write redundant comments for obvious behavior.
- Do not add unrelated architectural layers for formality.
- Do not test merely to create more tests or prove that testing happened.
- Do not expand the scope without authorization.

**Code quality comes from correctness, clarity, reliability, and maintainability—not the number of defensive branches, abstractions, or tests.**

<!-- prompt:end -->
