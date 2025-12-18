/**
 * HookTesterComponent.tsx
 *
 * Purpose:
 * - Provides a reusable mechanism to test React hooks in isolation without
 *   requiring a full component UI.
 * - Supports React 18+ / React 19 environments where `@testing-library/react-hooks`
 *   is incompatible.
 * - Captures the return value of any hook for assertions in test files.
 *
 * Usage:
 * 1. Import `HookTester` and `hookResult` in your test.
 * 2. Render <HookTester hook={yourHook} /> inside the test.
 * 3. Access `hookResult` to inspect or assert hook outputs.
 *
 * Why it was written this way:
 * - Hooks cannot be called outside of a React component.
 * - This minimal component provides the necessary React context for the hook
 *   to run.
 * - Using a shared component reduces duplication across multiple hook tests.
 */

/**
 * Note: No explicit React import required; this module doesn't use JSX directly.
 */

// Stires the latest value of the hook being testecd
// `any` keeps it flexible for hooks returning different types
export let hookResult: any;

// {hook} - Ensuring it only pulls the hook prop and ignore other props
// : { hook: () => any } - tells TypeScript that hook must be a function, it takes no arguments and it can return anything
// The component expects a single prop called hook, which is a function. That’s the only thing it uses from the props.
export const HookTester = ({ hook }: { hook: () => any }) => {
  hookResult = hook();
  return null;
};