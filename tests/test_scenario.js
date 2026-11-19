const assert = require('node:assert/strict');
const scenario = require('../scripts/scenario.js');

const countCases = [
  ['35,000 tickets', 35000], ['35000 tickets sold', 35000], ['35k tickets', 35000],
  ['35 thousand distributed tickets', 35000], ['0 tickets', 0], ['10% will not show', null],
  ['1,250 seats', 1250], ['We sold 42,000', 42000], ['Only 75% attend', null],
  ['35.5k tickets', 35500]
];
for (const [text, expected] of countCases) assert.equal(scenario.parseCount(text), expected, `count: ${text}`);

const rateCases = [
  ['90% show up', .9], ['90 percent attend', .9], ['10% are no-shows', .1],
  ['a quarter of ticket holders do not arrive', .25], ['half of ticket holders do not show', .5],
  ['one tenth will not come', .1], ['5 percentage points', .05], ['75 percent attend', .75],
  ['100% show up', 1], ['0% attend', 0]
];
for (const [text, expected] of rateCases) assert.equal(scenario.parseRate(text), expected, `rate: ${text}`);

const sequenceCases = [
  ['We sold 35,000 tickets and 10% will not show up.', 31500],
  ['35,000 tickets, 10% are no-shows.', 31500],
  ['35k tickets and 90% show up.', 31500],
  ['There are 35 thousand tickets with 90% utilization.', 31500],
  ['We sold 35,000 tickets. Only 75% attend.', 26250],
  ['35,000 tickets, a quarter do not arrive.', 26250],
  ['35,000 distributed and one fourth will not come.', 26250],
  ['35,000 tickets; half are no-shows.', 17500],
  ['35,000 tickets and 100% attend.', 35000],
  ['35,000 tickets, nobody shows up.', 0],
  ['We sold 35,000 tickets and 20 percent will not arrive.', 28000],
  ['35k sold, 10% not coming.', 31500],
  ['35,000 seats sold; a tenth do not attend.', 31500],
  ['35,000 tickets and 90 percent attend.', 31500],
  ['35,000 tickets; 25% no-show.', 26250],
  ['35,000 sold with 80% turnout.', 28000],
  ['35,000 distributed; 5 percent will not show.', 33250],
  ['35,000 tickets and 0% no-show.', 35000],
  ['35,000 tickets, only three quarters attend.', 26250],
  ['35,000 tickets, another 5% do not come.', 'clarify']
];
for (const [text, expected] of sequenceCases) {
  const result = scenario.interpret(scenario.createState(), text);
  if (expected === 'clarify') assert.equal(result.kind, 'clarify', text);
  else if (expected === null) assert.notEqual(result.kind, 'calculation', text);
  else assert.equal(result.scenario?.arrivals, expected, text);
}

let state = scenario.createState();
state = scenario.interpret(state, 'We sold 35,000 tickets and 90% attend.').state;
let changed = scenario.interpret(state, 'What if only 80% attend?');
assert.equal(changed.scenario.arrivals, 28000);
let difference = scenario.interpret(changed.state, 'How many fewer people is that?');
assert.equal(difference.difference, 3500);
let ambiguous = scenario.interpret(changed.state, 'What if another 5% do not come?');
assert.equal(ambiguous.kind, 'clarify');
let clarified = scenario.interpret(ambiguous.state, 'I mean 5 percentage points.');
assert.equal(clarified.scenario.arrivals, 26250);
let parking = scenario.interpret(changed.state, 'What would that mean for parking?');
assert.equal(parking.vehicles, Math.ceil(28000 * .65 / 2.5));
console.log(`Passed ${countCases.length + rateCases.length + sequenceCases.length + 5} parser and conversation assertions.`);
