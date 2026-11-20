# Profile selection

Castella opens with **Select an account** for new visitors and offers exactly three local profiles: Lori Reams (LR), Anika Rao (AR) and Johnny Patrick (JP). Avatars are initials only.

## These are not accounts

Profiles are a personalized entry point, **not authentication**. There is no password, server, database or identity check. Anyone using the same browser can choose any profile, and profile data is readable by anyone with access to that browser's storage. Nothing sensitive is stored. The profile screen itself says so. No personality traits or data were invented for any team member; the selected name is used only for greetings.

## Flow

1. **First visit:** a full-screen navy selection screen. The app behind it is `inert` (not focusable or readable) until a profile is chosen. Focus starts on the first card; arrow keys move between cards; Enter/Space selects.
2. **Welcome:** "Welcome, {first name}." and "Your game-day command center is ready." fade in (≈0.3 s), hold, and fade as Chat is revealed (≈1.5 s; fully gone ≈1.8 s, measured in Chromium). Focus moves to the chat composer. The welcome text is also announced through a polite live region.
3. **Reduced motion:** with `prefers-reduced-motion: reduce`, the animation is skipped and Chat appears immediately; the welcome is still announced to screen readers.
4. **Returning visit:** the remembered profile opens Chat directly with "Welcome back, {name}."
5. **Switch account:** from the header profile menu or Settings → Profile. Switching happens without reloading: preferences, saved scenarios and achievements reload for the new profile, and the conversation restarts. Escape on the selection screen returns to the current profile.

## Storage layout

| Key | Contents |
|---|---|
| `castella_profile` | Selected profile id (`lori`, `anika`, `johnny`) |
| `castella:{id}:scenarios` | Saved simulator scenarios |
| `castella:{id}:earned` | Unlocked achievements |
| `castella:{id}:celebrated` | Sellout celebrations already shown |
| `castella:{id}:tone` | Personality (Professional / Balanced / Fun) |
| `castella:{id}:local_ai` | Assistant mode, Ollama endpoint and model name |
| `castella_legacy_claimed_by` | Which profile imported pre-profile data, if any |

Chat contents are **not** persisted; they stay in page memory as before.

If storage is blocked (private mode, quota, policy), `scripts/profiles.js` falls back to in-memory storage for the session and Settings shows a notice. The profile screen will then reappear on the next visit.

## Legacy data migration

Data saved before Phase 9 (`castella_scenarios`, `castella_earned`, `castella_celebrated`, `castella_tone`, `castella_local_ai`, and the original `cc_*` keys) is **unassigned**. It is:

- **Preserved:** never deleted or modified.
- **Not silently assigned:** it isn't merged into whichever profile is chosen first, because that person may not be the one who created it.
- **Optionally imported:** Settings → Profile shows what exists ("1 saved scenario, 0 achievements…") and offers **Import into this profile**. Import *copies* the data once into the current profile, merging with anything already there without duplicating scenario ids, and records the claiming profile so it can't also be imported into a second profile.
- **Validated:** unrecognized tone values and non-array scenario or achievement payloads are skipped.

Implementation: `scripts/profiles.js` (pure, Node-testable). Tests: `tests/test_profiles.js` (17 cases).
