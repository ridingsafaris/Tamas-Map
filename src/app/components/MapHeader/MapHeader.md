
# MapHeader Component

## Overview

The `MapHeader` component renders a fixed overlay header at the top of the
map. It provides branding, a central search box, and a right‑aligned action
button (desktop only). On mobile devices, only the centered search box is
visible. This component is **layout-only** and delegates interactive logic
to its child components.

## Dependencies

- **Child components**
  - `BrandingControl` -- brand/logo control (desktop only, left aligned).
  - `SearchBox` -- central search field (always visible).
  - `BlackSaddleButtonDesktop` -- special action button (desktop only, right aligned).
- **Framework / styling**
  - Tailwind CSS utility classes for responsive layout and positioning.

## Internal Refs & State

- None.  
  The component is stateless and contains no refs.

## Context Data (selected)

- None directly.  
  Context data usage is delegated to the child components.

## Key Methods

- None.  
  No internal methods are defined since this is purely a presentational layout component.

## Effects

- None.  
  No `useEffect` hooks are used inside this component.

## Rendering

The component renders:

- A top‑fixed header container (`absolute top-0 left-0 w-full h-20 lg:h-30 z-20`).  
- **Left column (desktop only, `w-1/4`)**: `BrandingControl`.  
- **Center column (full width on mobile, `w-1/2` on desktop)**: `SearchBox`.  
- **Right column (desktop only, `w-1/4`)**: `BlackSaddleButtonDesktop`.  

The layout ensures that the header always overlays the map, with the search box
centered, and side controls available only on larger screens.
