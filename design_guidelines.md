# ArthaMind Design Guidelines

## Design Approach
**System-Based Approach** drawing from Linear's clean dashboard aesthetics, Stripe's sophisticated restraint, and Notion's productivity focus. ArthaMind is a financial intelligence platform requiring data clarity and efficient workflows.

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts CDN)
- Monospace: JetBrains Mono (for numbers, data, metrics)

**Hierarchy:**
- Hero/Display: text-5xl to text-6xl, font-semibold
- Page Titles: text-3xl, font-semibold
- Section Headers: text-2xl, font-semibold
- Card Titles: text-lg, font-medium
- Body Text: text-base, font-normal
- Small Text/Captions: text-sm
- Data/Metrics: text-2xl to text-4xl, font-mono, font-bold

## Layout System

**Spacing Primitives:**
Core units: 2, 4, 6, 8, 12, 16, 20 (as in p-2, m-4, gap-6, py-8, etc.)

**Container Strategy:**
- Dashboard: max-w-7xl with px-6
- Content sections: max-w-6xl
- Forms/Cards: max-w-2xl
- Data tables: w-full with horizontal scroll on mobile

**Grid Patterns:**
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Metrics overview: grid-cols-2 lg:grid-cols-4
- Charts section: grid-cols-1 lg:grid-cols-2
- Main layout: Sidebar (fixed w-64) + Content area (flex-1)

## Component Library

**Navigation:**
- Persistent sidebar navigation (desktop): w-64, fixed left, full height
- Logo/brand at top (h-16 header area)
- Navigation items with icon + label, py-3, px-4, rounded-lg
- Active state: slightly elevated appearance
- Mobile: Collapsible hamburger menu, full-screen overlay

**Dashboard Cards:**
- Rounded corners: rounded-xl
- Padding: p-6
- Shadow: subtle elevation
- Borders: 1px solid
- Header section with title + action icon
- Body with metrics or chart
- Footer with timestamp/metadata (text-sm)

**Charts & Data Visualization:**
- Chart container: aspect-video or h-80
- Chart titles above: text-lg, font-medium, mb-4
- Legend positioned top-right or bottom
- Responsive: maintain readability on mobile
- Grid lines: minimal, subtle
- Data labels: font-mono for precision

**Forms & Inputs:**
- Input fields: rounded-lg, p-3, border, focus ring
- Labels: text-sm, font-medium, mb-2
- Helper text: text-xs below input
- Button groups: gap-3
- Form sections: space-y-6
- Multi-column forms on desktop: grid-cols-2, gap-6

**Buttons:**
- Primary: px-6, py-3, rounded-lg, font-medium
- Secondary: px-4, py-2, rounded-lg
- Icon buttons: p-2, rounded-lg
- Buttons on images: backdrop-blur-md with semi-transparent background
- No custom hover states needed (component handles this)

**Data Tables:**
- Header row: sticky top-0, font-medium, text-sm
- Cell padding: px-4, py-3
- Alternating row treatment for readability
- Monospace font for numerical columns
- Right-align numerical data
- Action column (icons) at the end

**Modals & Overlays:**
- Modal backdrop: backdrop-blur-sm
- Modal container: max-w-2xl, rounded-2xl, p-8
- Header with title + close button
- Content area with appropriate spacing
- Footer with action buttons (right-aligned)

**Status Indicators:**
- Badges: px-3, py-1, rounded-full, text-xs, font-medium
- Toast notifications: React Toastify with consistent positioning (top-right)
- Loading states: Spinner or skeleton screens for data-heavy components

## Page-Specific Layouts

**Landing Page (Pre-Auth):**
- Hero section: 85vh with centered content
- Large hero image: Abstract financial visualization (graphs, data streams) with overlay
- Headline: text-5xl, font-bold, max-w-3xl
- Subheading: text-xl, max-w-2xl, mt-4
- CTA buttons: Two-button layout (primary + secondary) with gap-4, mt-8
- Features section: 3-column grid showcasing core capabilities with icons
- Social proof: Single row of metrics (4 columns): Users, Transactions, Accuracy %, Uptime
- Final CTA: Centered section with compelling copy + email capture form

**Dashboard (Post-Auth):**
- Two-column layout: Sidebar (w-64) + Main content (flex-1)
- Top bar: h-16, user profile + notifications + quick actions
- Main content padding: p-8
- Welcome section: User greeting + key metric summary (4-column grid)
- Chart section: 2-column grid, gap-6
- Recent activity table below charts
- Quick actions card in sidebar

**Analytics Page:**
- Full-width charts with filters above
- Time range selector: Pill-style buttons (7D, 30D, 90D, 1Y, All)
- Primary chart: Large (h-96) with detailed data
- Supporting charts: 2x2 grid below
- Export button: Top-right corner

## Icons
**Library:** Heroicons (via CDN)
- Navigation: outline style
- Actions: solid style
- Micro-interactions: mini size

## Images

**Hero Image (Landing):**
- Abstract 3D visualization of financial data flows, network graphs, or geometric patterns representing wealth intelligence
- Placement: Full-width background behind hero section
- Treatment: Gradient overlay to ensure text readability
- Style: Modern, sophisticated, tech-forward aesthetic

**Dashboard Placeholders:**
- Profile avatars: Circular, 40x40px default
- Empty states: Friendly illustration with actionable copy

## Animation Principles
**Minimal & Purposeful:**
- Page transitions: Subtle fade (200ms)
- Card hover: Slight elevation change (transform scale: 1.02, 150ms)
- Chart rendering: Smooth data animation on load (Chart.js default)
- NO scroll-triggered animations
- NO excessive motion

## Responsive Breakpoints
- Mobile: < 768px (stack all grids, collapse sidebar)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (full multi-column layouts)

## Accessibility
- Focus states: Prominent ring on all interactive elements
- Form labels: Always visible, associated with inputs
- Color contrast: Ensure AA compliance minimum
- Icon buttons: Always include aria-labels
- Data tables: Proper table markup with headers

---

**Design Philosophy:** Clean, data-forward interface that prioritizes information clarity and efficient workflows. Every element serves a functional purpose. Sophistication through restraint, not decoration.