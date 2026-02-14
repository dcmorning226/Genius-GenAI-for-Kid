# CLAUDE.md - Universal Development Guidelines

> Global guidelines for Claude Code interactions. Project-specific documentation should exist in each project's root CLAUDE.md.

## 1. Design Philosophy

### KISS - Keep It Simple, Stupid
- Write the simplest solution that works
- Avoid premature optimization
- No speculative features - implement only what is requested
- Prefer clarity over cleverness

### DRY - Don't Repeat Yourself
- Extract common patterns into reusable components
- Use existing utilities before creating new ones
- Reference existing implementations as templates

### Anti-Patterns to Avoid
- Adding "nice-to-have" features not requested
- Over-engineering simple solutions
- Creating abstractions for single-use cases
- Adding excessive error handling for unlikely scenarios

## 2. Quality & Accuracy (Anti-Hallucination Protocol)

### Before Answering or Writing Code
1. **Read First** - Always read relevant source files before modifying or discussing them
2. **Verify Imports** - Check actual exports/interfaces of modules before using them
3. **Check Existing Patterns** - Search codebase for similar implementations
4. **Validate Assumptions** - If uncertain about behavior, read the code rather than assume

### Investigation Requirements
- Use `Glob` and `Grep` to find relevant files
- Read function signatures and types before calling them
- Check package.json/pubspec.yaml for actual dependencies
- Reference existing CLAUDE.md files in subdirectories for module-specific constraints

### Red Flags (Pause and Investigate)
- Using an API without having read its documentation/source
- Assuming a file exists without checking
- Guessing at function signatures or return types
- Making claims about code behavior without reading it

## 3. Action-Oriented Behavior

### Proactive Coding
- When asked to implement something: **write the code**, don't just explain how
- When a bug is described: **fix it**, don't just describe the fix
- When improvement is needed: **make the change**, don't just suggest it

### Handling Ambiguity
When user intent is unclear:
1. Analyze the context and codebase patterns
2. Infer the most logical interpretation
3. State your interpretation clearly
4. Proceed with implementation
5. Invite feedback: "I interpreted X as Y. Let me know if you meant something different."

### Avoid Passive Behavior
Instead of: "You could do X or Y, what do you prefer?"
Prefer: "Based on the codebase patterns, I'll implement X. [reasoning]"

## 4. Task Continuity & Progress Tracking

### Real-Time Tracking (TodoWrite)
- Use TodoWrite for tasks with 3+ steps
- Update status immediately as work progresses
- Mark tasks complete only when fully verified

### Long Task Checkpoints
For tasks requiring extended work:

1. **When to Checkpoint**
   - Before complex refactoring
   - After completing a major phase
   - When context usage approaches ~70%

2. **Checkpoint Location**
   - Directory: `.claude/checkpoints/`
   - Format: `{date}-{brief-description}.md`

3. **Checkpoint Content**
   ```
   # Checkpoint: {Task Description}
   Date: {YYYY-MM-DD HH:MM}

   ## Completed
   - [x] Item 1
   - [x] Item 2

   ## In Progress
   - [ ] Current item (state: ...)

   ## Remaining
   - [ ] Item 3
   - [ ] Item 4

   ## Key Files Modified
   - path/to/file.ts - description

   ## Resume Notes
   - Next steps...
   - Important context...
   ```

4. **Resuming Work**
   - Read checkpoint file first
   - Verify current state matches checkpoint
   - Continue from "In Progress" item

### Never
- End task prematurely due to token concerns
- Leave work half-done without checkpoint
- Lose track of multi-step implementations
