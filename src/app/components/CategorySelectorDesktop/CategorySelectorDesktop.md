
# CategorySelectorDesktop Component

## Overview

The `CategorySelectorDesktop` component renders a vertical list of ride
categories as toggle buttons, visible only on desktop. It also supports
a special **“BLACK SADDLE”** category, which resets filters and applies
a different selection behavior.

## Dependencies

- **Context**
  - `useMapData` -- provides ride categories and price intervals.
  - `useFilterData` -- provides and updates selected categories, riding level,
    months, price interval, and Black Saddle state.
- **Framework**
  - React (`useEffect`).

## Internal Refs & State

- None.  
  Uses context and effect hooks only.

## Context Data (selected)

From `useMapData`:  
- `rideCategoriesShort`  
- `tripPriceInterval`, `nightPriceInterval`  

From `useFilterData`:  
- `selectedCategories`, `setSelectedCategories`  
- `setSelectedRidingLevel`  
- `selectedPriceType`  
- `setSelectedPriceInterval`  
- `setSelectedMonths`  
- `blackSaddleSelected`, `setBlackSaddleSelected`  

## Key Methods

### `categoryClickedHandler(e)`  
Toggles the clicked category on or off, based on the button’s text.

### `blackSaddleClickedHandler()`  
- Clears riding level.  
- Resets price interval to full range (depending on price type).  
- Clears selected months.  
- Toggles Black Saddle mode and sets categories to `["BLACK SADDLE"]`.  

## Effects

- **Auto-reset Black Saddle**:  
  If `selectedCategories` becomes empty, sets `blackSaddleSelected` to false.

## Rendering

The component renders (desktop only):  
- Vertical button list of ride categories.  
- Buttons toggle active state with bold text + full opacity.  
- Includes a dedicated “BLACK SADDLE” button with special logic.  
