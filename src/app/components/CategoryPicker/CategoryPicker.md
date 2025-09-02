# CategoryPicker Component

## Overview

The `CategoryPicker` component renders a **selectable pill list** for choosing
categories. Each pill behaves like a checkbox (pressed = selected), with an
optional checkmark icon. This is a Next.js client component (`"use client"`).

## Dependencies

- **External libraries**
  - [`@heroicons/react`](https://heroicons.com/) — uses `CheckIcon` for the selected state.
- **Context**
  - *(none)* — the component is fully controlled via props.
- **Child components**
  - *(none)*

## Props

- `options: string[]` — List of category names to render as selectable pills.
- `values: string[]` — List of **currently selected categories**. The component
  checks selection with `values.includes(category.toUpperCase())`, so your
  `values` array should contain **UPPERCASE** strings (or you can transform your
  data upstream to match this expectation).
- `onChange?: (categoryUpper: string) => void` — Fired when a pill is clicked,
  passing the **UPPERCASE** category string. The parent is responsible for
  toggling add/remove behavior and updating `values` accordingly.

## Key Methods

### `toggleCategory(category)`
Uppercases the clicked `category` and invokes `onChange?.(category.toUpperCase())`.
Note that the component **does not** manage the selected list; it simply emits the
category key. The parent should handle toggling in/out of the `values` array.

## Rendering & Interaction

- Renders a **flex-wrapped row** of buttons based on `options`.
- A pill is considered **selected** if `values` contains the **UPPERCASE** variant of the option.
- **Accessibility**:
  - Each pill is a `<button>` with `role="checkbox"` and `aria-checked={isSelected}`.
  - `aria-label` is set to `Toggle {category} category` to describe intent.
  - Keyboard users can activate pills with the keyboard thanks to the native button element.
- **Iconography**:
  - When selected, the pill shows a `CheckIcon` before the category label.

## Styling

- **Container:** `p-2`
- **Pill row:** `flex flex-wrap gap-2 max-w-4xl mx-auto`
- **Pills (base):**
  - `flex items-center gap-1 px-3 py-2 rounded-full border text-xs font-medium transition cursor-pointer`
- **Selected state:** `bg-[#000] text-white border-gray-600` with a leading `CheckIcon` (`w-4 h-4`).
- **Unselected state:** `border-gray-400 text-gray-700 hover:bg-gray-100`.

## Usage Example

```jsx
"use client";
import { useState } from "react";
import CategoryPicker from "@/components/CategoryPicker";

export default function Example() {
  const options = ["Food", "Drinks", "Dessert", "Vegan"];
  const [values, setValues] = useState(["FOOD"]); // store as UPPERCASE

  const handleChange = (catUpper) => {
    setValues((prev) =>
      prev.includes(catUpper) ? prev.filter((c) => c !== catUpper) : [...prev, catUpper]
    );
  };

  return (
    <div className="p-6">
      <CategoryPicker options={options} values={values} onChange={handleChange} />
      <pre className="mt-4 text-sm">Selected: {JSON.stringify(values)}</pre>
    </div>
  );
}
```
