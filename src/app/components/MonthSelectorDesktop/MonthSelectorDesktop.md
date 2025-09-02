
# MonthSelectorDesktop Component

## Overview

The `MonthSelectorDesktop` component renders a vertical list of month
options on the right side of the screen (desktop only). Users can toggle
months on/off to filter rides.

## Dependencies

- **Context**
  - `useFilterData` -- provides and updates selected months.  
- **Props**
  - `options` -- array of month labels to display.  
  - `values` -- currently selected months.  
  - `onChange` -- optional, but not used internally.  

## Internal Refs & State

- None.  
  Stateless component; uses context and props.

## Context Data (selected)

From `useFilterData`:  
- `setSelectedMonths`  

## Key Methods

### `monthClickedHandler(e)`  
Toggles a month selection by label (taken from button text). Updates
`selectedMonths` in context.

## Effects

- None.  
  Component uses direct click handlers only.

## Rendering

The component renders (desktop only):  
- Vertical list of month buttons, placed on the right side.  
- Active months are bold with full opacity.  
- Buttons toggle their selection state when clicked.  
