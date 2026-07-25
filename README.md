# Appointment Duration Sorter

This Manifest V3 Chrome extension sorts **appointment choices** from the shortest duration to the longest. It supports the Noodzakelijk Online booking pages and Google Calendar appointment-scheduling pages.

Supported Google Calendar booking routes include public `selfsched` and appointment pages on `calendar.google.com`, plus `calendar.app.google`. The content script also runs in matching embedded frames, so an embedded public booking page is handled in place.

## Safety boundary

The normal Google Calendar week/day/month grid is intentionally excluded. Calendar events use placement and layout managed by Google; moving those DOM elements would corrupt the calendar interface. The extension only handles recognised, sibling appointment-choice elements and leaves headings, date separators, and unrelated controls where they are.

## Install for testing

1. Open `chrome://extensions` and enable **Developer mode**.
2. Select **Load unpacked** and choose this repository folder.
3. Open a supported appointment page and refresh it.

The extension watches dynamic page changes. It sorts only a contiguous run of recognised appointment choices, so dynamically added choices are re-sorted without duplicating controls or crossing a section boundary.

## Supported duration labels

Durations can be supplied by `data-appointment-duration`, `data-duration`, or `data-duration-minutes`, or by visible/accessible labels such as `NO 30`, `30 minutes`, `30 minuten`, `30m`, `1 hour`, or `1 uur`. This includes booking buttons where the duration is present only in `aria-label`.

## Test fixture

`test-page.html` supplies an unsorted visual fixture. For the repeatable content-script check, run:

```sh
npm install
npm test
```

The test verifies initial ordering, a dynamically added appointment, and that a calendar grid is not changed.
