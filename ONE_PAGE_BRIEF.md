# Castella | Game-day attendance planning

## Decision

How many people should stadium operations prepare for, and how can attendance evidence inform resource planning?

## Evidence

The supplied “Forecasting NFL Game Attendance” research summary reports 5,104 games from 2000–2019. Random Forest had the lowest cross-validated MAE among three evaluated methods at 3,045 fans, compared with 4,344 for Ridge Regression and 4,401 for Linear Regression.

## What the demo supports

Castella makes the research understandable and lets a planner enter a ticket count and low, expected, and high utilization assumptions. It converts those assumptions into illustrative arrivals and unused tickets, then translates arrivals into operational quantities using ratios the user supplies.

## Recommendation

Use the simulator to compare planning scenarios and make assumptions visible. Replace illustrative inputs with the venue's paired ticket and scan history and approved operating ratios before using outputs for real staffing or inventory decisions.

## Limitations

The original model, source poster, game-level dataset, and validation predictions were unavailable. The app does not make future-game predictions or estimate NFL-wide no-show rates. MAE is an average error, not an individual-game interval. Operations outputs are not safety standards.
