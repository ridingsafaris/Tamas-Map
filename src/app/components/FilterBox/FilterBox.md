# FilterBox Component

## Overview

The `FilterBox` component renders a **slide-in filter panel** for
narrowing down available rides. It leverages **Framer Motion** for
animations, reads ride/filter state from context, and provides a
user-friendly UI for filtering and exploring rides.

## Dependencies

-   **External libraries**
    -   [`@heroicons/react`](https://heroicons.com/) -- `XMarkIcon` for
        the close button.
    -   [`framer-motion`](https://www.framer.com/motion/) -- `motion`,
        `AnimatePresence` for entry/exit animations.
-   **Context**
    -   `useMapData` -- provides ride availability and filter panel
        visibility state.
-   **Child components**
    -   `Accordion` -- collapsible filter sections inside the panel.

## Props

-   *(none)* -- This component does not accept external props. It fully
    relies on context.

## Context Data

From `useMapData`: - `isFilterBoxVisible` -- controls whether the filter
panel is shown.\
- `setIsFilterBoxVisible` -- toggles visibility.\
- `availableRides` -- number of rides matching the current filters.

## Key Methods

### `closeHandler()`

Closes the filter panel by setting `isFilterBoxVisible` to `false`.

### `handleToggleChange(data)`

Currently logs toggle changes to the console (placeholder for future
functionality).

## Rendering & Animation

-   Uses `AnimatePresence` and `motion.div` for smooth slide-in/out from
    the right.\
-   Panel layout:
    -   **Header row**:
        -   Title `"Filters"`\
        -   Close button (`XMarkIcon`)\
    -   **Main content**:
        -   Scrollable container holding filter controls (currently just
            an `Accordion`).\
    -   **Footer button**:
        -   `"Explore {availableRides} rides"` button which closes the
            panel when clicked.

## Styling

-   Positioned as an **absolute right sidebar**, responsive across
    breakpoints:
    -   Full width on mobile.\
    -   Half width on medium screens.\
    -   Quarter width on large screens.\
-   White background, rounded corners, subtle shadow, scrollable filter
    area.
