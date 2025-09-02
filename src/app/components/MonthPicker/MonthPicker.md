
# MonthPicker Component

## Overview

The `MonthPicker` component renders a compact, accessible month selector as a grid of
toggle buttons. Each button represents a month and can be toggled on/off. The component
is **controlled** via its `values` prop and notifies the parent about changes through
its `onChange` callback.

## Dependencies

-   **External libraries**
    -   `@heroicons/react/20/solid` — uses `CheckIcon` for selected state.
    -   React (Client Component).
-   **Context**
    -   None.
-   **Child components**
    -   None.
-   **Utilities**
    -   None.

## Props

-   `options: string[]` — List of month labels to render. **Required.**
-   `values: string[]` — Currently selected months. **Required.**
    -   Selection check uses `values.includes(month.toUpperCase())`, so ensure that
        the `values` array contains **uppercase** month labels (e.g., `"JAN"`).
-   `onChange?: (month: string) => void` — Callback fired when a month is toggled.
    -   The component passes the clicked month label to the parent, which is expected
        to update `values` accordingly.

## Internal Refs & State

-   None.  
    The component is stateless; selection is driven entirely by props.

## Context Data (selected)

-   None.

## Key Methods

### `toggleMonth(month)`

Invokes `onChange(month)` if provided. Used by each button’s `onClick` handler to
notify the parent component that the user toggled a month.

## Effects

-   None.  
    There are no React effects in this component.

## Rendering

The component renders:

-   An outer padding container (`<div className="p-2">`).  
-   A **grid** of month buttons (`grid grid-cols-3 gap-3 max-w-md mx-auto`) wrapped
    in a group with `role="group"` and `aria-label="Filter by month"` for accessibility.
-   Each button:
    -   Calls `onClick={() => toggleMonth(month)}` (passing a function reference, not invoking on render).
    -   Has `aria-pressed={isSelected}` to expose the toggle state to assistive tech.
    -   Uses Tailwind classes to switch styles between selected and unselected states.
    -   When selected, shows a decorative `CheckIcon` with `aria-hidden="true"` and `focusable="false"`.

