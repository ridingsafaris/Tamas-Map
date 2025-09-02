# Map Component

## Overview

The `Map` component renders an interactive Mapbox GL map with filtering,
ride markers, clustering, and popups. It acts as the **main map
container** for displaying rides, with support for currency conversion,
category/month filtering, and integration with various UI controls.

## Dependencies

-   **External libraries**
    -   [`mapbox-gl`](https://docs.mapbox.com/mapbox-gl-js/) -- map
        rendering.
    -   React (`useState`, `useEffect`, `useRef`).
-   **Context**
    -   `useMapData` -- provides map state, rides, exchange rates, etc.
    -   `useFilterData` -- provides filter settings (months, categories,
        prices, riding level, etc).
-   **Child components**
    -   `MapHeader`
    -   `FilterBox`
    -   `SearchBoxToggle`
    -   `CategorySelectorDesktop`
    -   `MonthSelectorDesktop`
    -   `PriceSelectorDesktop`
    -   `RidesLayer`
    -   `ClusterLayer`
    -   `RidePopup`
    -   `LoadingSpinner`
-   **Utilities**
    -   `normalizePricesFromUSD`
    -   `currencySymbols`

## Internal Refs & State

-   `mapContainerRef` -- reference to the `<div>` container where Mapbox
    attaches.
-   `mapRef` -- reference to the Mapbox instance (persists across
    renders).

## Context Data (selected)

From `useMapData`: - `map`, `setMap`, `mapReady`, `setMapReady`\
- `isLoading`, `setIsLoading`\
- `isFilterBoxVisible`, `isFilterToggleVisible`,
`setIsFilterToggleVisible`\
- `ridesGeojson`, `setAvailableRides`\
- `rideMonths`\
- `tripPriceInterval`, `nightPriceInterval`, `setTripPriceInterval`,
`setNightPriceInterval`\
- `clickedRide`, `setClickedRide`\
- `priceTypes`, `selectedGeocode`, `isSuggestionSelected`,
`setIsSuggestionSelected`\
- `selectedRide`\
- `exchangeRates`

From `useFilterData`: - `selectedMonths`, `setSelectedMonths`\
- `selectedCategories`\
- `selectedCurrency`\
- `selectedPriceType`\
- `selectedRidingLevel`\
- `selectedPriceInterval`

## Key Methods

### `drawRoundedRect(ctx, x, y, w, h, r)`

Utility for drawing rounded rectangles on a canvas.

### `addPillboxImageToMap(map, fillColor, borderColor, imageId)`

Draws a pill-shaped marker image and registers it with Mapbox
(`map.addImage`). Used for custom ride markers.

### `mapLoadHandler()`

Executed when the Mapbox map loads. Adds custom marker images and sets
context states (`mapReady`, `map`, `isLoading`).

### `monthClickedHandler(e)`

Toggles a month filter on/off when a month is clicked.

### `resetClickedRide()`

Resets the selected ride popup.

## Effects

-   **Init Map**: Creates Mapbox instance once and attaches load
    handler.\
-   **Filter Box Toggle**: Shows/hides filter toggle depending on filter
    box state.\
-   **Filter Rides**: Updates displayed rides whenever filters change
    (categories, months, currency, price range, etc).\
-   **Geocode Fit**: Moves/zooms the map when a geocode result is
    selected.\
-   **Ride Focus**: Zooms/centers the map when a ride is selected.

## Rendering

The component renders: - Fullscreen map container
(`<div ref={mapContainerRef} />`)\
- `RidesLayer` + `ClusterLayer` (map layers)\
- `RidePopup` (when a ride is selected)\
- UI controls (`MapHeader`, selectors, `FilterBox`)\
- `LoadingSpinner` (when loading)\`
