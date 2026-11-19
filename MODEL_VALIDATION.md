# Model validation and status

The supplied research summary reports cross-validated MAE of 4,401 fans for Linear Regression, 4,344 for Ridge Regression, and 3,045 for Random Forest. Random Forest's reported MAE is 1,356 lower than Linear Regression's, approximately 30.8% lower relative to 4,401. The summary says 2019 was reserved for final testing.

Castella has not independently reproduced these metrics. The project owner supplied the poster title, “Forecasting NFL Game Attendance,” but the poster file was not found in the inspected workspace. No original model file, notebook, predictions, or training data were provided. Castella does not generate arbitrary future-game forecasts, confidence intervals, or team-level predictions. It does not use the 2019 holdout for tuning.

The ticket-utilization simulator is deterministic arithmetic, not a trained no-show model. Staffing, concessions, parking, and entry outputs depend on visitor-entered assumptions and are not industry benchmarks.

## Phase 4

The Phase 4 supplemental TidyTuesday export has 638 team-season rows / 10,846 team-week observations. It is not the original 5,104-game training dataset. No modeling performance or causal effects are inferred from supplemental charts. Original 4,401 / 4,344 / 3,045 MAE figures remain unchanged.
