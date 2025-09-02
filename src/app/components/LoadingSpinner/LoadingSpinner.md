
# LoadingSpinner Component

## Overview

The `LoadingSpinner` component renders a full‑screen overlay with a centered
animated spinner. It is used to indicate that the application is loading
data or performing an operation that requires the user to wait.

## Dependencies

- **Framework**
  - React (functional component).
- **Styling**
  - Tailwind CSS utility classes for positioning, colors, borders, and animation.

## Internal Refs & State

- None.  
  The component is stateless and contains no refs.

## Context Data (selected)

- None.  
  The component does not consume any context.

## Key Methods

- None.  
  The component has no internal functions beyond its render logic.

## Effects

- None.  
  The component has no hooks or side effects.

## Rendering

The component renders:  
- A full‑screen overlay (`fixed inset-0`) with semi‑transparent black background (`bg-[#000000]/50`).  
- A centered spinner element (`w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin`).  
  - The spinner is created by using a border with one side transparent and applying a CSS spin animation.  
