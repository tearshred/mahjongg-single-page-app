export const getTileClassNames = (isSelected: boolean): string => {
  const baseClasses =
    "relative inline-block w-30 h-auto cursor-pointer m-1";

  return `${baseClasses}`;
};
