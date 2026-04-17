# Snake Game with Local High Score Storage

## Goal Description

Create a simple Snake game using plain HTML/CSS/JS with retro pixel aesthetics. The game should support arrow key controls, display current score during gameplay, and persist the top 5-10 high scores in localStorage so they remain available when the page is reopened.

## Acceptance Criteria

- AC-1: Game renders and runs in a browser with plain HTML/CSS/JS only, no external dependencies
  - Positive Tests (expected to PASS):
    - Opening index.html in a browser displays the game canvas
    - No console errors on page load
  - Negative Tests (expected to FAIL):
    - External CDN dependencies should not be required
    - Game should not require a build step or server
  - AC-1.1: Game board renders with visible grid/snake/food
    - Positive: Canvas shows snake, food, and game area
    - Negative: Blank canvas with no rendered elements fails

- AC-2: Snake moves continuously at default speed using arrow key controls
  - Positive Tests (expected to PASS):
    - Pressing arrow keys changes snake direction
    - Snake moves automatically without input
    - Game responds to all four arrow keys (up, down, left, right)
  - Negative Tests (expected to FAIL):
    - Snake should not move if game hasn't started
    - Invalid keys (non-arrow) should be ignored

- AC-3: Game ends on collision with walls or self, displays game-over state
  - Positive Tests (expected to PASS):
    - Snake dies when hitting canvas boundaries
    - Snake dies when colliding with its own body
    - Game-over message or restart prompt appears
  - Negative Tests (expected to FAIL):
    - Snake passing through walls should not be allowed
    - Snake passing through itself should not be allowed

- AC-4: Score increases when snake eats food, current score displays during gameplay
  - Positive Tests (expected to PASS):
    - Score increments by 1 when snake eats food
    - Current score is visible on screen during play
  - Negative Tests (expected to FAIL):
    - Eating food without score increase fails
    - Score display hidden during gameplay fails

- AC-5: High scores persist across page reloads using localStorage
  - Positive Tests (expected to PASS):
    - After game over, score appears in leaderboard
    - Refreshing page retains all stored high scores
    - Leaderboard shows top scores sorted descending
  - Negative Tests (expected to FAIL):
    - Scores cleared on page refresh fails the requirement
    - Scores not visible after reopening page fails

- AC-6: Retro pixel visual aesthetic applied to game
  - Positive Tests (expected to PASS):
    - Blocky/pixelated snake segments visible
    - Arcade-inspired color scheme (green snake, dark background)
    - Pixel-style font for score display if used
  - Negative Tests (expected to FAIL):
    - Smooth anti-aliased graphics fail the retro look
    - Modern gradient backgrounds fail the aesthetic

- AC-7: Arrow keys control snake without triggering browser scroll
  - Positive Tests (expected to PASS):
    - Pressing arrow keys moves snake without scrolling page
    - Page remains stationary during extended gameplay
  - Negative Tests (expected to FAIL):
    - Arrow keys causing page scroll fails

- AC-8: Leaderboard displays top 5-10 high scores
  - Positive Tests (expected to PASS):
    - Leaderboard shows up to 10 highest scores
    - Scores sorted highest to lowest
  - Negative Tests (expected to FAIL):
    - More than 10 scores displayed fails the requirement

- AC-9: README.md exists at project root with complete documentation
  - Positive Tests (expected to PASS):
    - README.md file present in project root
    - Contains project title and description
    - Contains installation steps (open index.html)
    - Contains usage instructions
    - Contains configuration options section
    - Contains project structure overview
  - Negative Tests (expected to FAIL):
    - Missing README.md fails
    - Incomplete sections fail

- AC-10: Git commits use conventional commit prefix feat:
  - Positive Tests (expected to PASS):
    - Commit messages start with feat:
    - Meaningful commit messages describing changes
  - Negative Tests (expected to FAIL):
    - Commits without feat: prefix fail the requirement

- AC-11: RLCR (Review-Local-Change-Review) development mode enforced
  - Positive Tests (expected to PASS):
    - Code changes go through iterative review cycles
    - Each change is locally validated before progression
  - Negative Tests (expected to FAIL):
    - Single-pass implementation without iteration fails

## Path Boundaries

### Upper Bound (Maximum Acceptable Scope)
The implementation includes a complete Snake game with: canvas-based rendering, arrow key controls, collision detection (walls and self), score tracking, localStorage persistence for top 10 high scores with timestamps, retro pixel visual styling, game-over screen with restart option, and a complete README.md with all required sections. All code uses plain HTML/CSS/JS with no external dependencies or build steps.

### Lower Bound (Minimum Acceptable Scope)
The implementation includes a basic Snake game with: canvas rendering, arrow key movement, wall/self collision detection, score display, localStorage persistence for top 5 high scores, basic retro styling, and a minimal README.md with project description and usage instructions.

### Allowed Choices
- Can use: localStorage for persistence; canvas or DOM-based rendering; inline CSS/JS or separated files
- Cannot use: External frameworks (React, Vue, etc.); server-side storage; build tools or bundlers; external API calls

## Feasibility Hints and Suggestions

### Conceptual Approach
A single-file or three-file (index.html, style.css, script.js) implementation using HTML5 Canvas for rendering. The game loop uses setInterval or requestAnimationFrame. Snake position stored as array of coordinate objects. Food position randomly generated avoiding snake body. Collision detection checks head position against walls and body segments. localStorage stores JSON array of score objects {score, timestamp}. On page load, scores are read and displayed in sorted order.

### Relevant References
- index.html - Main game page and canvas element
- style.css - Retro pixel styling rules
- script.js - Game logic, controls, storage handling
- README.md - Project documentation

## Dependencies and Sequence

### Milestones
1. **Game Core Implementation**: Create HTML structure, canvas setup, game loop, snake movement, food generation
2. **Collision & Scoring**: Implement wall/self collision detection, score tracking, display updates
3. **Persistence Layer**: Add localStorage read/write, leaderboard display, sorted score management
4. **Visual & UX**: Apply retro pixel styling, prevent arrow key scroll, add game-over state
5. **Documentation**: Write comprehensive README.md with all required sections
6. **Git History**: Create commits with conventional feat: prefix

## Task Breakdown

| Task ID | Description | Target AC | Tag (`coding`/`analyze`) | Depends On |
|---------|-------------|-----------|----------------------------|------------|
| task1 | Set up HTML structure and canvas | AC-1 | coding | - |
| task2 | Implement snake movement and controls | AC-2, AC-7 | coding | task1 |
| task3 | Add food generation and eating logic | AC-4 | coding | task2 |
| task4 | Implement collision detection | AC-3 | coding | task3 |
| task5 | Add localStorage persistence for high scores | AC-5, AC-8 | coding | task4 |
| task6 | Apply retro pixel visual styling | AC-6 | coding | task5 |
| task7 | Create README.md with full documentation | AC-9 | coding | task6 |
| task8 | Set up git commits with feat: prefix | AC-10 | coding | task7 |
| task9 | Verify RLCR mode is enforced | AC-11 | analyze | task8 |

## Claude-Codex Deliberation

### Agreements
- Plain HTML/CSS/JS is the correct approach for "simple as possible" demo code
- localStorage is the appropriate persistence mechanism for browser-local score storage
- Retro pixel look is achievable with canvas rendering and blocky styling
- Arrow key scroll prevention is a known UX issue requiring preventDefault handling

### Resolved Disagreements
- Leaderboard size: Claude suggests top 10 for maximum storage, Codex suggested 5 as cleaner. Resolution: Support top 10 (upper bound of "5-10" in draft) for more complete implementation while keeping lower bound at 5 for minimal viable approach.

### Convergence Status
- Final Status: `partially_converged` (direct mode - skipped convergence loop)

## Pending User Decisions

- DEC-1: Leaderboard size (5 vs 10)
  - Claude Position: Support top 10 high scores (matches upper bound of draft's "5-10")
  - Codex Position: Top 5 is cleaner and sufficient for demo code
  - Tradeoff Summary: More scores = more storage complexity and UI space; fewer = simpler but less history retained
  - Decision Status: `PENDING` - awaiting user preference

- DEC-2: Wall collision behavior (die vs wrap)
  - Claude Position: Snake dies on wall collision (classic arcade behavior)
  - Codex Position: Could wrap around for less frustrating gameplay
  - Tradeoff Summary: Die on wall = classic Snake; wrap = easier for beginners
  - Decision Status: `PENDING` - awaiting user preference

- DEC-3: Direction reversal prevention
  - Claude Position: Prevent reversing into yourself (standard Snake behavior)
  - Codex Position: Allow it (simpler code, more chaotic gameplay)
  - Tradeoff Summary: Prevention = expected behavior but slightly more code; allowing = unexpected deaths
  - Decision Status: `PENDING` - awaiting user preference

## Implementation Notes

### Code Style Requirements
- Implementation code and comments must NOT contain plan-specific terminology such as "AC-", "Milestone", "Step", "Phase", or similar workflow markers
- These terms are for plan documentation only, not for the resulting codebase
- Use descriptive, domain-appropriate naming in code instead