export const getTileClassNames = (isSelected: boolean): string => {
  const baseClasses = "relative inline-block w-30 h-auto cursor-pointer m-1";
  const selectedClasses = isSelected ? " ring-4 ring-red-500 rounded-lg" : "";

  return `${baseClasses}${selectedClasses}`;
};
