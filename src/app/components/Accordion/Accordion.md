
# Accordion Component

## Overview

The `Accordion` component renders a multi-section filter panel composed of collapsible
items for **Riding Level**, **Categories**, **Month**, and **Price Range**. It coordinates
filter state via context hooks and exposes an optional prop to set the initially open
section. The file also defines a presentational subcomponent, **`AccordionItem`**, used
to structure each collapsible panel with a header, tooltip popover, and animated body.

## Dependencies

-   **External libraries**
    -   React (`useState`, `useRef`, `useEffect`).
    -   `@heroicons/react` — `ChevronDownIcon`, `QuestionMarkCircleIcon`.
-   **Context**
    -   `useMapData` — provides currencies, price types, riding levels, ride months,
        category lists, and default price intervals.
    -   `useFilterData` — provides and updates the selected filters (months, categories,
        currency, price type, riding level, and price interval).
-   **Child components**
    -   `ThreeWayToggle`
    -   `TwoWayToggle`
    -   `PriceRangeSlider`
    -   `CategoryPicker`
    -   `MonthPicker`
    -   `AccordionItem` (defined in the same file)
-   **Utilities**
    -   None.

## Props

-   `openAccordionIndex: number | null` — Index (0-based) of the section that should be
    open initially (e.g., `0` = Riding Level, `1` = Categories, `2` = Month, `3` = Price Range).
    If `null` or omitted, no section is open on first render.

### `AccordionItem` (subcomponent) Props

-   `type?: "top" | "bottom"` — Optional styling hints for borders at the top/bottom panels.
-   `title: string` — Section title displayed in the header.
-   `tooltip: string | ReactNode` — Text/element shown in a small popover next to the title.
-   `children: ReactNode` — Collapsible panel content.
-   `isOpen: boolean` — Whether the panel is expanded.
-   `onToggle: () => void` — Toggles the open/closed state, handled by the parent `Accordion`.

## Internal Refs & State

-   **Accordion**
    -   `openIndex` (`useState`) — controls which panel is open; initialized from `openAccordionIndex`.
-   **AccordionItem**
    -   `bodyRef` (`useRef<HTMLDivElement>`) — references the collapsible body to measure its `scrollHeight`.
    -   `showPopover` (`useState<boolean>`) — controls the visibility of the tooltip popover.
    -   `maxHeight` (`useState<string>`) — inline style to animate the body height (`"0px"` vs. measured height).

## Context Data (selected)

From `useMapData`:
- `currencies`
- `priceTypes`
- `ridingLevels`
- `rideMonths`
- `rideCategoriesLong`
- `tripPriceInterval`, `nightPriceInterval`

From `useFilterData`:
- `selectedMonths`, `setSelectedMonths`
- `selectedCategories`, `setSelectedCategories`
- `selectedPriceType`, `setSelectedPriceType`
- `selectedCurrency`, `setSelectedCurrency`
- `selectedRidingLevel`, `setSelectedRidingLevel`
- `selectedPriceInterval`, `setSelectedPriceInterval`

## Key Methods

### `toggleItem(index)`
Toggles which accordion section is open by setting `openIndex` to `index` if closed,
or `null` if the same index is clicked again.

### `ridingLevelChangedHandler(level)`
Sets `selectedRidingLevel` in filter context.

### `monthChangedHandler(clickedMonth)`
Toggles a month in `selectedMonths` (stored as **uppercase** labels).

### `categoryChangedHandler(category)`
Toggles a category in `selectedCategories` (stored as **uppercase** labels).

### `currencyChangedHandler(currency)`
Sets `selectedCurrency` in filter context.

### `priceTypeChangedHandler(priceType)`
Maps a **label** to a key from `priceTypes` (e.g., `"Trip"` → `"TRIP"`) and updates
`selectedPriceType` accordingly.

### `rangeSliderChangedHandler(interval)`
Updates `selectedPriceInterval` when the price range slider changes.

### `AccordionItem` header/tooltip interactions
- Header click triggers `onToggle` (from parent).
- Tooltip popover opens on mouse move over the icon and closes on mouse leave; event
  handlers call `stopPropagation()` to avoid toggling the panel when interacting with
  the tooltip.

## Effects

-   **AccordionItem: expand/collapse animation** — A `useEffect` updates `maxHeight`
    whenever `isOpen` changes, using `bodyRef.current.scrollHeight` when opening and
    `"0px"` when closing.

-   **Accordion** — No effects in the parent component.

## Rendering

The component renders:

-   A bordered, rounded container (`id="accordion-collapse"`) wrapping four `AccordionItem`s:
    1. **Riding Level** — `ThreeWayToggle` bound to `ridingLevels` and `selectedRidingLevel`.
    2. **Categories** — `CategoryPicker` bound to `rideCategoriesLong` and `selectedCategories`.
    3. **Month** — `MonthPicker` bound to `rideMonths` (values) and `selectedMonths`.
    4. **Price Range** — Currency `ThreeWayToggle`, price type `TwoWayToggle` (maps labels to keys),
       and `PriceRangeSlider` with `min/max` derived from `tripPriceInterval` or `nightPriceInterval`
       based on `selectedPriceType`.

-   Each `AccordionItem` header shows a rotating `ChevronDownIcon` to indicate open/closed state
    and a `QuestionMarkCircleIcon` that reveals a tooltip popover on hover.

-   Collapsible bodies animate open/closed via `maxHeight` and Tailwind transitions.

