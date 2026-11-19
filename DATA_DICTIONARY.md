# Supplemental attendance dictionary

Grain: one historical city/name and season per export row, with an array of 17 team-week observations. These records are independent of the original Purdue research sample.

| Field | Type | Meaning |
| --- | --- | --- |
| id | string | Historical city, team name, and season, separated by pipes; unique |
| team | string | Source city and team name; historical names retained |
| season | integer | 2000–2019 inclusive |
| home | integer | Source-reported season home attendance total, emitted once |
| away | integer | Source-reported season away attendance total, emitted once |
| total | integer | home + away for that team-season, emitted once |
| weekly | array | Source weekly attendance, weeks 1–17 in order; missing is null |

The source dictionary calls these attendance figures without defining them as ticket scans or unique physical people. The dashboard labels them reported attendance. Weekly means use nonmissing team-week values. They include home and away appearances; both teams can report the same game. Season means use team-season counts. NFL-wide summed team-week attendance would double-count appearances and is not presented as a unique-game total. A missing value is not zero.

Tickets sold, tickets distributed, reported attendance, scans, unique physical attendees, and estimated arrivals are separate concepts. The simulator multiplies a user-entered eligible ticket count by an assumed utilization rate. Neither home season totals nor weekly source figures can establish a measured no-show rate. No game-type filter, home-game mean, or highest/lowest unique-game ranking is provided because game identity and home-game denominators were not verified.
