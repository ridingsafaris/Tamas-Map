
# RidePopup Component

## Overview

The `RidePopup` component renders a **Mapbox GL popup** that displays a compact ride
card (image, title, categories, riding levels, and description excerpt). It uses
`createPortal` to render React content into a DOM node that is injected into the
Mapbox popup via `setDOMContent`. The popup is positioned at the ride’s click
coordinates and updates whenever `activeFeature` changes.

## Dependencies

- **External libraries**
  - React (`useEffect`, `useRef`, `useState`).
  - `react-dom` — `createPortal` for rendering into the popup container.
  - `mapbox-gl` — Popup instance and map API.
  - `@heroicons/react/24/solid` — `XCircleIcon` close icon.
- **Context**
  - None.
- **Child components**
  - None.
- **Utilities**
  - Internal helper `safeJsonParse(jsonString, fallback)` to safely parse JSON-encoded
    arrays in feature properties.

## Props

- `map` *(required)* — **Mapbox GL Map** instance. Used to create and add a `mapboxgl.Popup`
  and to attach the popup to the map at specific coordinates.
- `activeFeature` *(required for rendering)* — Object describing the clicked ride:
  - `clickPos: [lng: number, lat: number]` — popup anchor position.
  - `feature: GeoJSON.Feature` — Mapbox feature with the following `properties` fields expected:
    - `name: string`
    - `image_url: string`
    - `category: string` (JSON-encoded string array)
    - `riding_level: string` (JSON-encoded string array)
    - `description?: string`
    - `isBlackSaddle?: boolean`
    - `black_saddle_url?: string`
    - `url?: string`
- `onClose?: () => void` — Optional callback invoked when the close icon is clicked.

## Internal Refs & State

- `popupRef` — `useRef<mapboxgl.Popup | undefined>`; holds the Popup instance.
- `contentRef` — `useRef<HTMLDivElement>`; root container whose content is rendered via `createPortal`
  and injected into the Popup via `setDOMContent`.
- `imgLoading` — `useState<boolean>`; shows a small spinner overlay until the image finishes loading
  (or errors).

## Context Data (selected)

- None.

## Key Methods

### `closeIconClickedHandler()`
Calls `onClose` via optional chaining to allow the parent to clear `activeFeature` or
otherwise close the popup.

### `safeJsonParse(jsonString, fallback = [])`
Parses a JSON string and returns `fallback` if parsing fails, preventing runtime errors
from malformed data (e.g., `properties.category` or `properties.riding_level`).

## Effects

- **Create/destroy Popup (mount/unmount)**  
  On mount, instantiates `mapboxgl.Popup` with `closeOnClick: false`, `closeButton: false`,
  custom `className`, anchor `"bottom"`, and specific offsets. On unmount, calls
  `popupRef.current.remove()` to clean up.

- **Attach content + position (on `activeFeature` change)**  
  When `activeFeature` changes:
  - Resets `imgLoading` to `true`.
  - Creates a brand new DOM node (`contentRef.current = document.createElement("div")`).
  - Positions the popup with `.setLngLat(activeFeature.clickPos)`.
  - Injects the content node via `.setDOMContent(contentRef.current)`.
  - Adds the popup to the map with `.addTo(map)`.

- **Guard clauses**  
  If `!activeFeature` or the feature lacks `properties`, the component returns `null`
  to avoid rendering and prevent crashes.

## Rendering

The component renders nothing into the regular React tree; instead it returns a portal
to `contentRef.current` (the node provided to Mapbox Popup). The card includes:

- **Image area** (fixed height): shows a loading spinner until the image loads or errors.
- **Content block**: name (heading), categories (comma‑separated), riding levels (pipe‑separated),
  and a description truncated to 150 chars (if present).
- **Full‑card overlay link**: anchors the entire card to either `black_saddle_url`
  (when `isBlackSaddle` is true) or `url` otherwise.
- **Close button** (top‑right): triggers `onClose` when clicked.

