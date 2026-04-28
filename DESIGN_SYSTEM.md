# 📐 Material Design System (Durian Edition)

This document outlines the design tokens and UI principles used in the `src/index.css` file to achieve a modern Material Design aesthetic.

## 🎨 Design Tokens (CSS Variables)

The design is driven by a central set of tokens in `:root`:

### Colors (MD Baseline)
- `--primary`: `#1a8a3e` (Rich Emerald) - Primary brand color.
- `--accent`: `#f0a500` (Warm Gold) - For high-emphasis actions.
- `--surface`: `#ffffff` - Standard card/modal surface.
- `--background`: `#f0f4f1` - Subtle neutral background with organic tint.

### Elevation & Shadows
- `--shadow-sm`: Subtle elevation for standard cards.
- `--shadow-md`: Hover states and active elements.
- `--shadow-xl`: Deep shadows for Modals and Overlays.

### Shape & Radius
- `--radius-lg`: `24px` - Rounded corners for cards (MD3 style).
- `--radius-xl`: `32px` - Modals and Hero sections.
- `--radius-pill`: `50px` - Buttons and floating elements.

## 🧱 Component Patterns

### 1. Cards (Surfaces)
- Uses `var(--surface)` with `var(--radius-lg)`.
- Implements a 1.5px border for high-definition contrast.
- Animated `::before` gradient strip on hover.

### 2. Buttons (Actions)
- **Primary:** High-elevation with gradient fill and shadow glow.
- **Ghost:** Low-emphasis for secondary actions, using `var(--background-alt)`.

### 3. Inputs (Forms)
- Large touch targets (ideal for field use).
- Focus states use `--primary-glow` (4px ring) for accessibility.

### 4. Navigation (Bottom Bar)
- Glassmorphic backdrop (`backdrop-filter`).
- Pill indicator for active state (`--primary`).

## 📁 File Structure
- **Global Styles:** `src/index.css` (Contains all the above tokens and base components).
- **Font:** Google Font **'Prompt'** (Sans-serif, modern, highly readable).

---

### Tips for Consistency
เพื่อความคงเส้นคงวาของดีไซน์ (Design Consistency) ควรเรียกใช้ CSS Classes เช่น `.card`, `.btn`, `.input-group` แทนการเขียน inline styles ใหม่ครับ
