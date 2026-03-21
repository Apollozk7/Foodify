# Dashboard UX/UI Transformation Spec

## Objective
Transform the Dashboard from a scrolling document into a fixed-viewport App Interface to achieve "Total Speed" and eliminate the need for scrolling to find inputs.

## Architectural Changes

### 1. Root Layout (src/app/dashboard/page.tsx)
- **Container**: Change main `div` to `h-screen flex flex-col overflow-hidden`.
- **Header**: Reduce height and padding for more vertical space.
- **Main Area**: Use `flex-1 flex overflow-hidden`.
- **History Section**: Remove from the main workspace flow. It will be moved to a dedicated view or a side-drawer.

### 2. Chat Component (src/components/dashboard/chat-interface.tsx)
- **Height**: Change from `h-[650px]` to `h-full flex-1`.
- **Scrolling**: Apply `overflow-y-auto` only to the message list area.
- **Input Area**: Ensure it has a fixed position at the bottom of the chat container.
- **Visuals**: Improve paddings and gaps (`gap-4` instead of `gap-12`) to increase information density.

### 3. Design System (Tailwind)
- **Paddings**: standardise on `p-4` or `p-6` for dashboard views.
- **Borders**: Subtle `border-white/5` for section separation.
- **Blur**: Use `backdrop-blur-md` for the input area to maintain "Apple-style" aesthetics.

## Success Criteria
- [ ] User can see Header, AI Message, and Input Area on a 13" laptop without scrolling.
- [ ] Chat messages scroll independently of the rest of the UI.
- [ ] Input area is always reachable.
