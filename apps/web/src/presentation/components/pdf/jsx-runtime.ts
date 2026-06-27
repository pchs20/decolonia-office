/**
 * Custom JSX runtime for @react-pdf/renderer components.
 *
 * Problem: Next.js compiles every server module (including files in src/) with a
 * vendored RSC React that creates `Symbol('react.transitional.element')` elements.
 * @react-pdf/renderer only understands `Symbol('react.element')` (React 18), so
 * its reconciler rejects every element the PDF components produce.
 *
 * Fix: Use `__non_webpack_require__` — webpack's official escape hatch that
 * compiles to the native Node.js `require`, bypassing the RSC module alias — to
 * load the real React at runtime. PDF components opt into this runtime via the
 * `/** @jsxImportSource . *\/` pragma at the top of each file.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
const React = __non_webpack_require__("react") as typeof import("react");

export const Fragment = React.Fragment;

function toElement(type: any, props: any, key: any) {
  if (!props) return React.createElement(type, key != null ? { key } : null);
  const { children, ...rest } = props;
  const p = key != null ? { key, ...rest } : rest;
  if (children === undefined) return React.createElement(type, p);
  if (Array.isArray(children)) return React.createElement(type, p, ...children);
  return React.createElement(type, p, children);
}

export function jsx(type: any, props: any, key?: any) {
  return toElement(type, props, key ?? null);
}

export function jsxs(type: any, props: any, key?: any) {
  return toElement(type, props, key ?? null);
}

export function jsxDEV(type: any, props: any, key?: any) {
  return toElement(type, props, key ?? null);
}
