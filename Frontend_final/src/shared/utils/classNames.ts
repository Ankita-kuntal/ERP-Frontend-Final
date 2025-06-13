/**
 * Utility for conditionally joining CSS class names together
 * @param classes - List of class names or class name objects
 * @returns Combined class names string
 */
export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  return classes
    .filter(Boolean)
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      if (entry === null || entry === undefined || entry === false) return '';
      
      return Object.entries(entry)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => key)
        .join(' ');
    })
    .join(' ');
}
