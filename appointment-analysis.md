# Appointment Element Analysis

## noodzakelijkonline.nl Analysis

Based on the provided image, I can identify the following structure for the appointment elements on noodzakelijkonline.nl:

### DOM Structure
- Each appointment appears to be contained in a card-like element
- The cards are arranged horizontally in a row
- Each card contains:
  - A header with "NO" followed by the duration in minutes (e.g., "NO 30")
  - A description in Dutch showing the duration in minutes (e.g., "NL: 30 minuten afspraak")
  - An English translation of the duration (e.g., "EN: 30 minutes appointment")

### Appointment Duration Extraction
- The duration can be extracted from:
  1. The header text (e.g., "NO 30" → 30 minutes)
  2. The description text which contains the duration in minutes

### Card Structure Pattern
```
<div class="card"> <!-- or similar container class -->
  <div class="header">NO 30</div> <!-- or similar header class -->
  <div class="description">
    NL: 30 minuten afspraak
    EN: 30 minutes appointment
  </div>
</div>
```

### Observed Durations
- 30 minutes
- 60 minutes
- 120 minutes
- 240 minutes
- 480 minutes

## Google Agenda Appointment Scheduler Analysis

Since I don't have direct access to the Google Agenda appointment scheduler interface, I'll need to make educated assumptions based on common patterns in Google's UI and the requirements:

### Expected DOM Structure
- Google typically uses Material Design components
- Appointment options likely appear in a list or grid format
- Each appointment option probably contains:
  - A duration indicator (e.g., "30 minutes")
  - Possibly a time slot (if showing available times)
  - Possibly additional details like appointment type

### Potential Selectors
- Google often uses class names with prefixes like:
  - `gm-` or `ga-` for Google Agenda elements
  - Classes may include terms like `appointment-option`, `duration-item`, etc.
- The parent container might have classes like:
  - `appointment-list`, `time-slots-container`, etc.

### Dynamic Content Detection
- Google applications typically use:
  - AJAX for dynamic content loading
  - MutationObserver can be used to detect when new appointments are added
  - The parent container of appointment elements should be observed for changes

## Common Strategy for Both Platforms

### Duration Extraction Strategy
1. Look for numeric values followed by "minutes" or "minuten" in the text content
2. Extract the numeric value using regex: `/(\d+)\s*(minutes|minuten)/i`
3. Store the extracted duration as a numeric value for sorting

### Sorting Strategy
1. Identify the parent container of all appointment elements
2. Extract all appointment elements into an array
3. Extract the duration from each element
4. Sort the array based on duration (ascending order)
5. Reinsert the sorted elements into the parent container

### Dynamic Content Handling
1. Use MutationObserver to watch for changes to the parent container
2. When new elements are added, re-run the sorting algorithm
3. Set a small debounce (e.g., 100ms) to avoid excessive re-sorting during rapid changes

This analysis will guide the development of the content script to ensure it works effectively on both platforms.
