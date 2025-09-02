
# RidesLayer Component

## Overview

The `RidesLayer` component adds ride markers to a Mapbox GL map using a GeoJSON
source and a `symbol` layer. Each marker is rendered as a pill‑shaped icon with a
dynamic price label that adapts to the ride’s currency and the currently selected
price type (trip vs. night). The layer also handles user interactions
(click/hover) and updates shared state when a ride is clicked.

## Dependencies

- **External libraries**
  - React (`useEffect`, `useRef`).
  - Mapbox GL JS map instance API (provided via `map` prop).
- **Context**
  - `useMapData` — supplies `ridesGeojson`, click/loading state setters, and a helper
    to note when the map was clicked.
  - `useFilterData` — supplies `selectedPriceType` to determine which price field to show.
- **Utilities**
  - `currencySymbols` — used to prefix prices with the correct currency symbol.

## Props

- `map` *(required)* — **Mapbox GL Map** instance used to add the GeoJSON source,
  create layers, attach/detach event listeners, query features, and animate the map
  (`easeTo`).

## Internal Refs & State

- `initializedRef` — boolean ref that prevents re‑initialization of the source,
  layer, and event bindings for a given map instance.

## Context Data (selected)

From `useMapData`:  
- `ridesGeojson` — GeoJSON of ride points (used as the source data).  
- `setClickedRide` — sets the currently clicked ride (coordinates + feature).  
- `isLoading`, `setIsLoading` — indicates loading state during click handling.  
- `setMapWasClicked` — records a map click outside of a ride feature.

From `useFilterData`:  
- `selectedPriceType` — `"TRIP"` or `"NIGHT"`; controls which price field is shown.

## Key Methods

### `priceTextFieldExpression` (Mapbox expression)
Determines the price label text shown on each marker, concatenating the appropriate
currency symbol with either `price` or `price_per_night` depending on
`selectedPriceType`. Supports `"USD"`, `"EUR"`, and `"GBP"`.

### `layerClickedHandler(e)`
Handles clicks on individual ride markers:
- Prevents default interaction.
- Sets loading state, constructs a `clickedRecord` (`clickPos`, `feature`), and
  stores it with `setClickedRide`.
- Clears loading state and animates the map towards the ride
  (slight vertical offset + zoom to `7`).

### `mouseOverHandler` / `mouseMoveHandler` / `mouseOutHandler`
Updates the mouse cursor to a pointer when hovering over ride markers and resets it
when leaving.

### `mapClickedHandler`
Clears the selected ride and flags that a generic map click occurred (outside any marker).

### `initializeLayer()`
- Adds a clustered GeoJSON source `rides-src` with `ridesGeojson` data.  
- Adds a `symbol` layer `rides-lyr` that renders:
  - **Icon**: `"black-pillbox"` if `isBlackSaddle` is true, otherwise `"white-pillbox"`.
  - **Text**: price label defined by `priceTextFieldExpression`.
  - **Layout**: anchored/centered icon with text size 12, overlap allowed.
  - **Paint**: text color white for Black Saddle rides, black otherwise.
- Registers event listeners:
  - `click` (map-wide) → `mapClickedHandler`
  - `click` on `rides-lyr` → `layerClickedHandler`
  - `mouseover` / `mousemove` / `mouseout` on `rides-lyr` → cursor handlers

## Effects

- **Initialization**  
  On first mount (and once per map instance), the component sets up the source,
  layer, and event listeners. The guard `initializedRef` prevents duplicate
  initialization.

- **Cleanup**  
  When unmounting (and if the style is loaded), the component removes its event
  listeners from the map.  
  > *Note:* In the provided code the cleanup uses `map.of("click", ...)` — this
  appears to be a typo and should likely be `map.off("click", ...)` to detach the
  handler.

## Rendering

The component returns `null`; it does not render JSX elements. All rendering is
done by configuring layers and interactions on the Mapbox GL map instance.
