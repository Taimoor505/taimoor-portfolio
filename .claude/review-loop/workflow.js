export const meta = {
  name: 'portfolio-hostile-review-loop',
  description: 'Manager plans; UX + UI agents improve the portfolio; 2 hostile QA agents score until 9/10; hostile manager audits QA until 9/10',
  phases: [
    { title: 'Plan', detail: 'Strict manager audits the site and writes the plan' },
    { title: 'Build', detail: 'UX agent then UI agent apply changes' },
    { title: 'QA', detail: 'Two hostile QA agents tear it apart and score /10' },
    { title: 'Manager Review', detail: 'Manager hunts for QA mistakes and scores /10' },
  ],
}

const ROOT = 'C:/Users/Hp/Desktop/automation-portfolio/taimoor-portfolio-v2'
const MAX_CYCLES = 3      // manager review cycles
const MAX_ROUNDS = 4      // build -> QA rounds per cycle
const PASS = 9

const CONTEXT = `
PROJECT: Taimoor Asif's personal portfolio (AI engineer, Lahore). Next.js 15 App Router + React 19 + Tailwind v4, at ${ROOT}.
Content lives in lib/data.ts and lib/site.ts. Pages: app/page.tsx (home: Hero, Wings, BuiltShippedLive, ReleaseHistory, Practice, SayHello), app/projects, app/projects/[slug], app/experience, app/contact. Components in components/{home,projects,experience,shared,shell}. Global styles app/globals.css plus per-area .css files.
A dev server is ALREADY RUNNING at http://localhost:3000 with hot reload. Do NOT start another dev server and do NOT run "npm run build" (it clobbers .next used by the dev server). Type-check with "npx tsc --noEmit".
To SEE the site: load the built-in browser tools via ToolSearch ("select:mcp__Claude_Browser__tabs_create,mcp__Claude_Browser__navigate,mcp__Claude_Browser__computer,mcp__Claude_Browser__read_page,mcp__Claude_Browser__get_page_text,mcp__Claude_Browser__resize_window,mcp__Claude_Browser__read_console_messages,mcp__Claude_Browser__tabs_close"). Create your OWN tab with tabs_create and pass its tabId on every call; close it when done. Check desktop and mobile (resize_window preset "mobile" on your tab, then reset to preset "desktop"). Also check dark/light if the site supports it. If the browser is unreachable, fall back to reading code carefully.
HARD RULES for everyone:
- Never invent facts about Taimoor (roles, clients, metrics, dates, employers). Rewording/restructuring existing claims is fine; new factual claims are not.
- Keep PostHog analytics (instrumentation*.ts) working. Don't touch .env files. Don't commit to git.
- The owner recently chose a Prussian blue palette; evolve it, don't throw it away.
- No new npm dependencies unless truly unavoidable.
`

const ISSUE = {
  type: 'object',
  properties: {
    severity: { type: 'string', enum: ['blocker', 'major', 'minor', 'nitpick'] },
    area: { type: 'string', enum: ['ux', 'ui'] },
    where: { type: 'string', description: 'file:line and/or page + viewport' },
    problem: { type: 'string' },
    fix: { type: 'string', description: 'concrete expected fix' },
  },
  required: ['severity', 'area', 'where', 'problem', 'fix'],
}

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    currentScore: { type: 'number' },
    verdict: { type: 'string' },
    vision: { type: 'string', description: 'what a 9/10 version of this portfolio looks like' },
    uxBrief: { type: 'array', items: ISSUE },
    uiBrief: { type: 'array', items: ISSUE },
  },
  required: ['currentScore', 'verdict', 'vision', 'uxBrief', 'uiBrief'],
}

const BUILD_SCHEMA = {
  type: 'object',
  properties: {
    changed: { type: 'array', items: { type: 'string' }, description: 'files changed + what' },
    addressed: { type: 'array', items: { type: 'string' } },
    pushedBack: { type: 'array', items: { type: 'string' }, description: 'issues NOT fixed, with justification' },
    typecheckPassed: { type: 'boolean' },
  },
  required: ['changed', 'addressed', 'pushedBack', 'typecheckPassed'],
}

const QA_SCHEMA = {
  type: 'object',
  properties: {
    score: { type: 'number', description: '0-10, one decimal' },
    summary: { type: 'string' },
    issues: { type: 'array', items: ISSUE },
  },
  required: ['score', 'summary', 'issues'],
}

const MGR_SCHEMA = {
  type: 'object',
  properties: {
    score: { type: 'number' },
    verdict: { type: 'string' },
    qaMistakes: { type: 'array', items: { type: 'string' }, description: 'what QA missed, got wrong, or let slide' },
    issues: { type: 'array', items: ISSUE },
  },
  required: ['score', 'verdict', 'qaMistakes', 'issues'],
}

const fmt = issues => issues.length
  ? issues.map((i, n) => `${n + 1}. [${i.severity}/${i.area}] ${i.where} — ${i.problem}\n   FIX: ${i.fix}`).join('\n')
  : '(none)'

// ---------- PLAN ----------
phase('Plan')
const plan = await agent(`${CONTEXT}
You are THE MANAGER: a ruthless, exacting creative director and planner. You think this portfolio is "good but not great" and you will not accept anything below ${PASS}/10. A 9/10 means a hiring manager at a top AI company would remember it and want to talk to Taimoor; it is polished on every viewport, fast, accessible, and the story is instantly clear.
Read every file in app/, components/, lib/ and view every page in the browser (desktop + mobile). Then:
1. Score the current site /10 honestly (be harsh).
2. Write the vision for the 9/10 version (positioning, narrative, hierarchy, visual direction).
3. Write a prioritized UX brief (information architecture, narrative, copy clarity, flows, CTAs, navigation, accessibility, performance, mobile ergonomics) and a prioritized UI brief (typography, spacing rhythm, color, components, motion, polish, responsive layout, dark mode). Each item must be concrete and actionable with a location. Highest-impact first. Don't do any editing yourself.`,
  { label: 'manager:plan', phase: 'Plan', schema: PLAN_SCHEMA })

log(`Manager baseline score: ${plan.currentScore}/10 — ${plan.verdict}`)

const history = []
let uxTodo = plan.uxBrief
let uiTodo = plan.uiBrief
let managerNotes = ''
let finalMgr = null

for (let cycle = 1; cycle <= MAX_CYCLES; cycle++) {
  let qaPassed = false
  let lastQA = []

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    const tag = `c${cycle}r${round}`

    // ---------- BUILD (sequential so the two builders never edit the same file concurrently) ----------
    const ux = await agent(`${CONTEXT}
You are the UX AGENT. You own: information architecture, narrative and copy, page flow, CTAs, navigation, accessibility semantics (landmarks, headings, focus order, labels, alt text, reduced motion), performance, and mobile ergonomics. The UI agent works after you on visual styling; don't do pure visual polish, but you may change markup/structure/copy as needed.
North-star vision from the manager:\n${plan.vision}
${managerNotes ? `Manager's latest verdict (he is furious):\n${managerNotes}\n` : ''}
Your issue list for this round (fix ALL blockers and majors; fix minors unless you can justify not to):\n${fmt(uxTodo)}
Make real edits to the code. Verify in the browser (desktop + mobile) and run "npx tsc --noEmit". If you think an issue is wrong, push back with a reason rather than silently skipping it. Return what you changed.`,
      { label: `ux:${tag}`, phase: 'Build', schema: BUILD_SCHEMA })

    const ui = await agent(`${CONTEXT}
You are the UI AGENT. You own: visual design — typography scale, spacing rhythm, color/palette and contrast, component styling, states (hover/focus/active), motion, responsive layout, dark mode, overall polish so it does not look templated. The UX agent just finished structural/copy changes this round:\n${ux ? JSON.stringify(ux.changed) : '(UX agent produced nothing)'}
Don't undo UX changes; build on them.
North-star vision from the manager:\n${plan.vision}
${managerNotes ? `Manager's latest verdict (he is furious):\n${managerNotes}\n` : ''}
Your issue list for this round (fix ALL blockers and majors; fix minors unless you can justify not to):\n${fmt(uiTodo)}
Make real edits to the code. Verify in the browser (desktop + mobile, both color schemes if supported) and run "npx tsc --noEmit". If you think an issue is wrong, push back with a reason. Return what you changed.`,
      { label: `ui:${tag}`, phase: 'Build', schema: BUILD_SCHEMA })

    const builderReport = `UX agent report: ${JSON.stringify(ux)}\nUI agent report: ${JSON.stringify(ui)}`

    // ---------- QA (two hostile reviewers, different lenses) ----------
    const QA_LENSES = [
      { key: 'qa-ux', lens: 'UX, content, accessibility (WCAG 2.1 AA: contrast, keyboard, focus, semantics, reduced motion), navigation, CTAs, performance, console errors, broken links, mobile usability' },
      { key: 'qa-ui', lens: 'visual design: typography, spacing consistency, alignment, color and contrast, component states, responsive breakpoints (320/375/768/1024/1440), dark mode, motion quality, anything that looks generic, AI-generated or unfinished' },
    ]
    const qa = (await parallel(QA_LENSES.map(q => () => agent(`${CONTEXT}
You are a HOSTILE QA AGENT (${q.key}). You dislike the UX and UI agents and do not want them to succeed. Your job is to find every flaw they introduced or left behind. Your lens: ${q.lens}. You also flag anything outside your lens you notice.
Rules of engagement: every issue must be REAL and verifiable — cite file:line and/or page + viewport, and say what you observed. Fabricated or vague complaints make you look incompetent to the manager, who is looking for exactly that. Check their pushbacks too: if a pushback is weak, re-raise it.
What the builders claim they did this round:\n${builderReport}
${lastQA.length ? `Issues raised last round (check each was really fixed; re-raise if not):\n${fmt(lastQA)}\n` : ''}${managerNotes ? `The manager says QA missed these last time — make sure they are fixed now:\n${managerNotes}\n` : ''}
Inspect the code AND the live site at http://localhost:3000 on every page, desktop and mobile. Do not edit any files.
Score /10 (one decimal). ${PASS}+ means you genuinely cannot find any blocker/major issue and only nitpicks remain — you hate giving it, but scoring dishonestly high or low will get you caught by the manager.`,
      { label: `${q.key}:${tag}`, phase: 'QA', schema: QA_SCHEMA })))).filter(Boolean)

    const scores = qa.map(r => r.score)
    const issues = qa.flatMap(r => r.issues)
    const serious = issues.filter(i => i.severity === 'blocker' || i.severity === 'major')
    history.push({ cycle, round, qaScores: scores, issues: issues.length, serious: serious.length })
    log(`Cycle ${cycle} round ${round}: QA scores ${scores.join(' / ')} — ${serious.length} blocker/major, ${issues.length} total`)

    lastQA = issues.filter(i => i.severity !== 'nitpick')
    uxTodo = issues.filter(i => i.area === 'ux')
    uiTodo = issues.filter(i => i.area === 'ui')

    if (qa.length === 2 && scores.every(s => s >= PASS) && serious.length === 0) { qaPassed = true; break }
  }
  if (!qaPassed) log(`Cycle ${cycle}: QA never reached ${PASS}/10 within ${MAX_ROUNDS} rounds — escalating to manager anyway`)

  // ---------- MANAGER REVIEW ----------
  const mgr = await agent(`${CONTEXT}
You are THE MANAGER again. You are strict, you only accept ${PASS}/10, and you despise the QA team — you suspect they are lazy, miss things, and pad scores. Your job now: audit the current site (code + live browser, every page, desktop + mobile) and the QA team's latest findings, and catch their mistakes: issues they missed, issues they wrongly claimed were fixed, false/vague complaints, scores that were too generous.
Your original vision:\n${plan.vision}
Score history so far: ${JSON.stringify(history)}
QA's most recent outstanding issues:\n${fmt(lastQA)}
Do not edit files. Score the site /10 honestly. ${PASS}+ only if you would put your name on it. List every QA mistake and every issue that still needs work (concrete, located, with a fix).`,
    { label: `manager:review-c${cycle}`, phase: 'Manager Review', schema: MGR_SCHEMA })

  finalMgr = mgr
  history.push({ cycle, managerScore: mgr.score })
  log(`Manager review cycle ${cycle}: ${mgr.score}/10 — ${mgr.verdict}`)
  if (mgr.score >= PASS) break

  managerNotes = `Score ${mgr.score}/10. ${mgr.verdict}\nQA mistakes: ${mgr.qaMistakes.join(' | ')}\n${fmt(mgr.issues)}`
  uxTodo = [...mgr.issues.filter(i => i.area === 'ux'), ...uxTodo]
  uiTodo = [...mgr.issues.filter(i => i.area === 'ui'), ...uiTodo]
}

return {
  baseline: plan.currentScore,
  finalManagerScore: finalMgr?.score,
  finalVerdict: finalMgr?.verdict,
  remainingIssues: finalMgr?.issues ?? [],
  history,
}
