
# PriceSelectorDesktop Component

## Overview

The `PriceSelectorDesktop` component renders a fixed bottom bar (desktop only)
that allows users to filter rides by price. It includes a pill selector for
choosing the price type (trip or night), a range slider for selecting the
price interval, and an “All Filters” button to toggle the filter panel.

## Dependencies

- **Child components**
  - `DesktopRangeSlider` -- range slider for selecting min/max price.
  - `PillSelector` -- pill-style toggle for selecting price type.
- **Context**
  - `useFilterData` -- provides and updates selected price interval, currency,
    and selected price type.
  - `useMapData` -- provides price intervals, price types, and filter box state.
- **Framework**
  - React (`useState`, `useRef` — though not actively used).

## Internal Refs & State

- None actively used.  
  (Imports `useRef` and `useState`, but no state/refs are declared inside.)

## Context Data (selected)

From `useFilterData`:  
- `selectedPriceInterval`, `setSelectedPriceInterval`  
- `selectedCurrency`  
- `selectedPriceType`, `setSelectedPriceType`  

From `useMapData`:  
- `tripPriceInterval`, `nightPriceInterval`  
- `priceTypes`  
- `isFilterBoxVisible`, `setIsFilterBoxVisible`  

## Key Methods

### `rangeSliderChangedHandler(interval)`  
Updates the selected price interval in context.

### `filterButtonClickedHandler()`  
Toggles visibility of the filter box.

### `priceTypeChangedHandler(priceTypeLabel)`  
Maps a clicked label back to a price type key and updates the selected price type.

## Effects

- None directly.  
  The component itself has no `useEffect`; it only updates context through handlers.

## Rendering

The component renders (desktop only):  
- **Left column (`w-1/4`)**: pill selector for price type.  
- **Center column (`w-1/2`)**: `DesktopRangeSlider` with min/max depending on selected type.  
- **Right column (`w-1/4`)**: “All Filters” button that toggles filter box visibility.  
