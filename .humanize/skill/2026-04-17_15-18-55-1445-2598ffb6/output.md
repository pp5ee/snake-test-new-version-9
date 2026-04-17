**CORE_RISKS**
- “Force the use of RLCR mode” is undefined in normal web-project terms; the biggest risk is building the wrong thing because `RLCR` has no clear technical meaning here.
- “Stored locally on the page” likely means `localStorage`, but that is an assumption; if the user expects server-side persistence or cross-device sync, the implementation will not match.
- “When I open it again next time” depends on same browser/profile and storage not being cleared; score history will disappear in private mode, cleared storage, or different browsers.
- “Just the top 5-10 high scores” is ambiguous; unclear whether it is top `5`, top `10`, configurable, or “up to 10”.
- “Default snake speed” is underspecified; there is no explicit expected tick rate, difficulty curve, or whether speed should stay constant.
- Arrow-key controls can conflict with page scrolling unless key handling and layout are designed carefully.
- Retro pixel aesthetic is subjective; without concrete constraints, visual acceptance may be disputed.

**MISSING_REQUIREMENTS**
- Define what counts as a score: apples eaten, survival time, distance, or another metric.
- Define game-over behavior: auto-restart, restart button, or press key to restart.
- Define pause/resume expectations, if any.
- Clarify whether reversing direction into yourself is blocked immediately.
- Clarify whether snake wraps at edges or dies on wall collision.
- Clarify canvas size / board grid size / mobile support expectations.
- Clarify whether high scores store only numbers or also timestamps / player names.
- Clarify duplicate score handling and sort order for ties.
- Clarify whether scores should be shown only after game over or live-updated.
- Clarify accessibility basics: focus state, keyboard-only play, reduced motion, color contrast.
- Clarify browser support targets.
- Clarify whether README “installation steps” should just be “open `index.html`” or include a local static server.

**TECHNICAL_GAPS**
- No explicit architecture choice is stated, though plain `HTML/CSS/JS` is simple and feasible; likely best is a single `index.html` plus separate `style.css` and `script.js`.
- Persistence mechanism is not specified; `localStorage` is the simplest fit, but quota errors and unavailable storage should be gracefully handled.
- “Keep the code as simple as possible” conflicts a bit with polished UX features like robust storage validation, responsive design, and accessibility; priorities need to be explicit.
- There is no testing/validation expectation; for demo code this may be fine, but acceptance should state manual behaviors to verify.
- “Git commits” is listed as mandatory, but if this is a draft requirement for an agent or contractor, the repo process should also specify branch/PR expectations; otherwise it is incomplete.
- README asks for configuration options, but the draft currently exposes almost no defined configuration knobs.

**ALTERNATIVE_DIRECTIONS**
- `localStorage` high-score list only: simplest, zero backend, works offline; downside is device/browser-local persistence only.
- `sessionStorage` instead: even simpler semantics for temporary demos; downside is scores disappear after browser session, so it fails the stated persistence goal.
- Single-file app (`index.html` with inline CSS/JS): maximum simplicity and portability; downside is weaker maintainability and messier README structure.
- Three-file app (`index.html`, `style.css`, `script.js`): still simple, cleaner separation; slight increase in file count.
- `canvas` rendering: ideal for classic Snake and pixel look; downside is more manual UI rendering.
- DOM-grid rendering with CSS squares: easier to inspect/debug and style; downside is less efficient and can be clunkier visually.
- Fixed top 5 leaderboard: cleaner UI and simpler rules; downside is less history retained.
- Fixed top 10 leaderboard: more forgiving and matches “5-10” upper bound; downside is slightly noisier UI.

**QUESTIONS_FOR_USER**
- What exactly does “RLCR mode” mean in this project?
- Should scores be stored with `localStorage`, or do you want another persistence method?
- Should the leaderboard keep top `5` or top `10` scores?
- Should each score include a timestamp, and/or a player name?
- Should the snake die on wall collision, or wrap around screen edges?
- Should reversing direction be disallowed?
- Should speed remain constant, or increase as score rises?
- Should there be a start screen, restart button, and pause support?
- Is desktop-only acceptable, or should mobile/touch support be considered?
- Do you want a single HTML file or separated `HTML/CSS/JS` files?

**CANDIDATE_CRITERIA**
- Game runs in a browser with plain `HTML/CSS/JS` only, with no external dependencies.
- Snake is controllable via arrow keys and movement feels consistent at the defined default speed.
- Game clearly ends on the defined loss condition and supports restarting.
- Current score is displayed during play.
- High scores persist across page reloads using the agreed local persistence mechanism.
- Leaderboard displays the agreed top-N scores, sorted descending.
- Retro pixel styling is present, including blocky visuals and arcade-inspired typography/colors.
- Page prevents arrow keys from causing unwanted browser scrolling during gameplay.
- README exists at `README.md` and includes title, description, prerequisites, install/use steps, configuration, and structure overview.
- If commit history is part of delivery, commits use conventional commit prefixes such as `feat:` and `docs:`.

If you want, I can turn this into a cleaned, implementation-ready spec next.
