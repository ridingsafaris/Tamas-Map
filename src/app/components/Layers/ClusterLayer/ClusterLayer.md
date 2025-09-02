
# ClusterLayer Component

## Overview

The `ClusterLayer` component renders **clustered ride markers** on a Mapbox GL map.  
It groups nearby ride points into circles when zoomed out and shows an abbreviated
count for each cluster. Clicking a cluster animates the map to zoom into it.

This component works in tandem with a rides source (`rides-src`) that has clustering
enabled, typically added in another component (such as `RidesLayer`).

## Dependencies

- **External libraries**
  - React (`useEffect`, `useRef`).
  - Mapbox GL JS (via `map` prop methods).
- **Map data**
  - Requires an existing source with id **`rides-src`** that has clustering enabled.

## Props

- `map` *(required)* — **Mapbox GL Map** instance.  
  Used to add cluster layers, attach/detach event listeners, query rendered features,
  compute expansion zoom for clusters, and animate the map view with `easeTo`.

## Internal Refs & State

- `initializedRef` — ensures the layer and its event bindings are only initialized
  once for a given map instance.

## Context Data (selected)

- None.  
  This component does not consume React context directly; it only depends on the `map`
  instance and the `rides-src` source.

## Key Methods

### `clusterClickedHandler(e)`
Handles clicks on cluster circles:  
- Queries the clicked feature from the `"clusters"` layer.  
- Extracts `cluster_id` and calls `getClusterExpansionZoom` on `rides-src` to calculate
  the zoom level needed to expand the cluster.  
- Smoothly animates the map to the cluster center at the returned zoom level.

### `initializeLayer()`
Adds two layers on top of the existing `rides-src` source:  
- **`clusters`** (circle layer):  
  - Renders cluster bubbles with size and color driven by `point_count` using `step`
    expressions.  
  - Colors: `#B0892D` (small), `#f1f075` (medium), `#f28cb1` (large).  
  - Radii: 20, 30, 40 for increasing cluster sizes.  
  - `circle-emissive-strength: 1` keeps circles visible with 3D lighting.  

- **`cluster-count`** (symbol layer):  
  - Displays abbreviated cluster counts (`point_count_abbreviated`) in white text.  
  - Uses `"DIN Offc Pro Medium"` and `"Arial Unicode MS Bold"` fonts at size 12.  

- Registers the cluster click handler with:  
  `map.on("click", "clusters", clusterClickedHandler)`.  

## Effects

- **Initialization**:  
  On mount, initializes the cluster layers once per map instance.  

- **Cleanup**:  
  On unmount (if the map is still loaded), removes the click handler:  
  `map.off("click", "clusters", clusterClickedHandler)`.  

## Rendering

The component returns `null`.  
It does not render JSX elements but instead configures layers and interactions directly
on the supplied Mapbox GL map instance.  
