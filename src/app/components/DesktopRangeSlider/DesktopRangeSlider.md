# DesktopRangeSlider Component

## Overview

The `DesktopRangeSlider` component renders a **dual-thumb price selector** tailored for desktop layouts.
It leverages **react-range** for slider mechanics, reads currency and rates from context, and displays
**live converted min/max values** flanking the slider. This is a Next.js client component (`"use client"`).

## Dependencies

- **External libraries**
  - [`react-range`](https://github.com/tajo/react-range) — dual-thumb range slider engine.
  - `react` — core React runtime.
- **Context**
  - `useFilterData` — provides the currently selected currency code.
  - `useMapData` — provides the exchange rates object.
- **Utilities**
  - `currencySymbols` — map of currency code to symbol used to prefix values.

## Props

- `interval: [number, number]` — Current selected `[min, max]` values. Controlled by the parent.
- `step: number` — Slider increment step.
- `min: number` — Minimum selectable value.
- `max: number` — Maximum selectable value.
- `onChange(values: [number, number]) => void` — Called during drag **and** on release with the new `[min, max]`.

## Context Data

From `useFilterData`:
- `selectedCurrency: string` — e.g., `"USD"`, `"EUR"`, `"HUF"`.

From `useMapData`:
- `exchangeRates: Record<string, any>` — accessed as `exchangeRates?.[selectedCurrency]?.USD`.

**Currency model implied by the component:** the base `interval` values are in **USD**, and
`exchangeRates[selectedCurrency].USD` is interpreted as *units of selectedCurrency per 1 USD*. Displayed
values are computed by multiplying the USD value by this rate and truncating to an integer.

## Key Methods

### `valueChangedHandler(val)`
Invokes the `onChange` prop (if provided) with the latest slider values. Wired to both
`react-range`’s `onChange` and `onFinalChange` so you receive updates while dragging and on release.

### `getConvertedPrice(value)`
Safely converts a numeric USD `value` into the `selectedCurrency` using
`exchangeRates?.[selectedCurrency]?.USD`. Returns a truncated integer via `parseInt(rate * value)`,
or `"-"` if the rate is invalid/unavailable. Logs a console warning on conversion errors.

## Rendering & Animation

- **Layout:** A horizontal flex row with min value (left), the slider (center), and max value (right).
- **Slider:** Renders a `Range` with two thumbs. Accessibility labels are provided via
  `ariaLabel={["Minimum price","Maximum price"]}`.
- **Track & selection:** A very thin gray track (`h-0.5`) with a white **filled segment** whose position and width are
  calculated from `interval`, `min`, and `max`:
  - `left = ((interval[0] - min) / (max - min)) * 100%`
  - `width = ((interval[1] - interval[0]) / (max - min)) * 100%`
- **Thumbs:** Circular handles that **grow** when dragged (`h-6 w-6` → `h-9 w-9`), with an inner white dot.
  Keyboard navigation is provided by `react-range`.
- **Readouts:** Left and right **value boxes** render the currency symbol from `currencySymbols[selectedCurrency]`
  and the converted amounts from `getConvertedPrice(...)`.

## Styling

- **Container:** `w-full px-0 py-4 pl-4 pr-8`
- **Row layout:** `flex items-center justify-between gap-8`
- **Value text:** `w-6 text-[#FFF] tracking-wider font-circular text-sm`
- **Track (outer):** `h-0.5 w-full bg-gray-800 rounded`
- **Selected segment (inner):** `h-0.5 bg-[#FFF] rounded`, positioned via inline `left`/`width` styles
- **Thumb wrapper:** `outline-none shadow-none`
- **Thumb (outer ring):** conditional size (`h-6 w-6` or `h-9 w-9`), `border-[3px] border-[#FFF]/50 bg-[#FFF]/0 rounded-full focus:outline-none focus:ring-0 drop-shadow cursor-pointer shadow-sm -translate-y-0.5`
- **Thumb (inner dot):** `h-2 w-2 rounded-full bg-[#FFF]`

