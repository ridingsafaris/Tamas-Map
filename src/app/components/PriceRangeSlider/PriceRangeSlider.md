# PriceRangeSlider Component

## Overview

The `PriceRangeSlider` component renders a **dual‑thumb price selector** for
choosing a minimum and maximum price. It builds on **react-range** for the
slider mechanics, reads currency state from context, and shows **live,
converted min/max values** beneath the track. This is a Next.js client component
(`"use client"`).

## Dependencies

- **External libraries**
  - [`react-range`](https://github.com/tajo/react-range) — dual‑thumb range slider engine.
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

**Currency model assumed by the component:** the base `interval` values are in **USD**,
and `exchangeRates[selectedCurrency].USD` is interpreted as *units of selectedCurrency per 1 USD*.
Displayed values are computed by multiplying the USD value by this rate.

## Key Methods

### `valueChangedHandler(val)`
Invokes the `onChange` prop (if provided) with the latest slider values. Wired to both
`react-range`’s `onChange` and `onFinalChange` so you receive updates while dragging and on release.

### `getConvertedPrice(value)`
Safely converts a numeric USD `value` into the `selectedCurrency` using
`exchangeRates?.[selectedCurrency]?.USD`. Returns a truncated integer via `parseInt(rate * value)`,
or `"-"` if the rate is invalid/unavailable. Logs a console warning on conversion errors.

## Rendering & Interaction

- Renders a `Range` with two thumbs. Accessibility labels are provided via
  `ariaLabel={["Minimum price","Maximum price"]}`.
- **Track & selection:** A gray track with a black **filled segment** whose position and width are
  calculated from `interval`, `min`, and `max`:
  - `left = ((interval[0] - min) / (max - min)) * 100%`
  - `width = ((interval[1] - interval[0]) / (max - min)) * 100%`
- **Thumbs:** Two circular handles; `react-range` provides keyboard navigation.
- **Readouts:** Two small cards labeled **Minimum** and **Maximum**, each showing
  the currency symbol from `currencySymbols[selectedCurrency]` and the converted amount from `getConvertedPrice(...)`.

## Styling

- **Container:** `w-full max-w-md mx-auto py-4 px-2`
- **Track:** `h-2 w-full bg-gray-200 rounded`
- **Selected segment:** `h-2 bg-[#000] rounded`, positioned via inline `left`/`width` styles.
- **Thumbs:** `h-6 w-6 rounded-full bg-white drop-shadow cursor-pointer shadow-sm -translate-y-2`
- **Readout cards:** `drop-shadow mt-2 p-3 border border-gray-200 rounded-xl`
- **Labels & text:** small, muted text with `text-sm text-gray-600`

