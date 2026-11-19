(function (root) {
  "use strict";

  const FRACTIONS = { "a quarter": 25, quarter: 25, "one quarter": 25, "three quarters": 75, "three quarter": 75, "a fourth": 25, "one fourth": 25, "a tenth": 10, "one tenth": 10, "a fifth": 20, "one fifth": 20, "half": 50 };

  function createState() {
    return { tickets: null, definition: "sold", showUp: null, noShow: null, previous: null, current: null, clarification: null, operations: { peoplePerVehicle: 2.5, carShare: 65 } };
  }
  function cloneScenario(s) { return s ? { ...s } : null; }
  function parseCount(text) {
    const s = text.toLowerCase().replace(/(?<=\d),(?=\d{3}\b)/g, "");
    const match = s.match(/\b(\d+(?:\.\d+)?)\s*(k|thousand)?\b/);
    if (!match) return null;
    const start = match.index;
    if (/^\s*(?:%|percent)/.test(s.slice(start + match[0].length))) return null;
    if (/\d{1,2}:\d{2}/.test(s.slice(Math.max(0, start - 3), start + match[0].length + 3))) return null;
    const value = Number(match[1]) * (match[2] ? 1000 : 1);
    if (!Number.isSafeInteger(value)) return null;
    const context = s.slice(Math.max(0, start - 18), start + match[0].length + 18);
    return value >= 100 || /tickets?|seats?|fans?|people|sold|distributed/.test(context) ? value : null;
  }
  function parseRate(text) {
    const match = text.match(/\b(\d{1,3}(?:\.\d+)?)\s*(?:%|percent|percentage points?)(?![a-z])/i);
    if (match) return Number(match[1]) / 100;
    const lower = text.toLowerCase();
    for (const [phrase, percent] of Object.entries(FRACTIONS).sort((a, b) => b[0].length - a[0].length)) if (lower.includes(phrase)) return percent / 100;
    return null;
  }
  function summarize(state) {
    if (state.tickets === null || state.showUp === null) return null;
    return { tickets: state.tickets, definition: state.definition, showUp: state.showUp, noShow: 1 - state.showUp, arrivals: Math.round(state.tickets * state.showUp), unused: Math.round(state.tickets * (1 - state.showUp)) };
  }
  function interpret(state, text) {
    const next = { ...state, previous: cloneScenario(state.previous), clarification: null };
    const lower = text.toLowerCase();
    const prior = summarize(state);
    let count = parseCount(text);
    const ticketContext = /tickets?|seats?|sold|distributed|attendance|attendees|fans/.test(lower);
    if (!ticketContext && !/what if|scenario|sold|distributed/.test(lower)) count = null;
    if (/negative|minus/.test(lower)&&count!==null&&/ticket|sold|distributed/.test(lower)) return {state,kind:'invalid',error:'Ticket counts cannot be negative.'};
    if (count !== null) next.tickets = count;
    if (/distributed/.test(lower)) next.definition = "distributed";
    else if (/sold/.test(lower)) next.definition = "sold";
    const rate = parseRate(text);
    const clarificationContext = Boolean(state.clarification);
    const noShowIntent = clarificationContext || /no[ -]?shows?|won['’]?t\s+(?:show|come|attend|arrive)|(?:do|does|will|would|are) not\s+(?:show|come|attend|arrive|coming|attending)|do(?:n['’]?t)\s+(?:show|come|attend|arrive|coming)|doesn['’]?t\s+(?:show|come|attend|arrive)|fail to (?:show|arrive)|not (?:show|attend|arrive|coming)|nobody (?:shows|comes|attends)/.test(lower);
    const showIntent = /show(?:ing)?\s+up|attend|arriv|utili[sz]|come to the game|turnout/.test(lower)||Boolean(rate!==null&&state.showUp!==null&&/what if|only|drops? to/.test(lower)&&!noShowIntent);
    const deltaIntent = /another|additional|extra|increase|goes? up|percentage points?|points? more/.test(lower);
    if (/nobody (?:shows|comes|attends)/.test(lower) && rate === null) next.showUp = 0;
    else if (/everyone (?:shows|comes|attends)/.test(lower) && rate === null) next.showUp = 1;
    if (rate !== null && deltaIntent && noShowIntent && !/percentage points?|points?/.test(lower) && !/proportionally|relative increase|percent increase/.test(lower)) {
      next.clarification = "Do you mean the no-show rate increases by percentage points, or increases proportionally from its current value? I have not changed the scenario yet.";
      return { state: next, kind: "clarify", scenario: summarize(next) };
    }
    if (rate !== null && deltaIntent && noShowIntent && next.noShow !== null) {
      const delta = /proportionally|relative increase|percent increase/.test(lower) ? next.noShow * rate : rate;
      next.showUp = Math.max(0, Math.min(1, 1 - next.noShow - delta));
    } else if (rate !== null && noShowIntent) {
      if (rate > 1) return { state: next, kind: "invalid", error: "No-show percentage must be between 0% and 100%." };
      next.showUp = 1 - rate;
    } else if (rate !== null && showIntent) {
      if (rate > 1) return { state: next, kind: "invalid", error: "Show-up percentage must be between 0% and 100%." };
      next.showUp = rate;
    } else if (rate !== null) {
      next.clarification = "Does that percentage describe people who will attend, or people who will not show up?";
      return { state: next, kind: "clarify", scenario: summarize(next) };
    }
    if (next.showUp !== null) next.noShow = 1 - next.showUp;
    const current = summarize(next);
    if (prior && current && (prior.tickets !== current.tickets || prior.showUp !== current.showUp)) next.previous = prior;
    if (current) next.current = current;
    if (/how many fewer|difference|fewer people|less people/.test(lower) && next.previous && next.current) {
      return { state: next, kind: "comparison", difference: next.previous.arrivals - next.current.arrivals, scenario: current };
    }
    if (/parking|vehicles?|cars?/.test(lower) && current) {
      const vehicles = Math.ceil(current.arrivals * next.operations.carShare / 100 / next.operations.peoplePerVehicle);
      return { state: next, kind: "parking", vehicles, scenario: current };
    }
    if (current && (count !== null || rate !== null || /scenario|what if|how many arrive|how many attend/.test(lower))) return { state: next, kind: "calculation", scenario: current };
    if (count !== null || next.showUp !== null) return { state: next, kind: "partial", scenario: current };
    return { state: next, kind: "other", scenario: current };
  }

  const api = { createState, parseCount, parseRate, summarize, interpret };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.CastellaScenario = api;
})(typeof window === "undefined" ? globalThis : window);
