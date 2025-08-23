// This tells TypeScript: 
// "Whenever you see an import that matches *.svg?react, treat it as a React component."

declare module "*.svg?react" {
  // Import React types because we’re describing a React component
  import * as React from "react";

  // Define what this "default export" looks like:
  // It’s a React Function Component that takes all the normal <svg> props
  // (like width, height, className, etc.), PLUS an optional `title` prop
  // (sometimes useful for accessibility).
  const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  // This makes the component available as the default export.
  // So when you do:
  //   import Tile from './tile.svg?react';
  // TypeScript knows "Tile" is a valid React component.
  export default ReactComponent;
}