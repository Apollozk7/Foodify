# Clerk Redesign & Localization Spec

## Objective
Seamlessly integrate Clerk authentication components into the Estúdio IA Pro design system and translate all user-facing text to Portuguese (PT-BR).

## Localization (PT-BR)
- Use `@clerk/localizations` for standard strings.
- Manually override specific labels in `appearance` if needed to match the brand tone.

## Visual Identity (Appearance Prop)
- **Base Theme**: Dark mode only.
- **Typography**: Primary font 'Inter', Headings 'Work Sans'.
- **Colors**:
  - `colorPrimary`: `#3b82f6`
  - `colorBackground`: `#020617`
  - `colorText`: `#ffffff`
  - `colorTextSecondary`: `#94a3b8`
  - `colorInputBackground`: `rgba(255, 255, 255, 0.05)`
  - `colorInputText`: `#ffffff`
- **Shape**: Rounded corners `1rem` (16px) to match Neumorph style.
- **Borders**: Subtle `rgba(255, 255, 255, 0.1)`.

## Integration Points
1. **Root Layout**: Update `<ClerkProvider>` with global appearance and localization settings.
2. **Custom Auth Pages**: Create `src/app/sign-in/[[...sign-in]]/page.tsx` and `src/app/sign-up/[[...sign-up]]/page.tsx`.
3. **User Profile**: Customize the `<UserProfile />` component to hide unnecessary social metadata if possible.

## Success Criteria
- [ ] No English text remains in the auth flow.
- [ ] Sign-in page feels like part of the website, using the same mesh gradient backgrounds.
- [ ] Clerk components use the same primary blue and border radii as the Dashboard.
