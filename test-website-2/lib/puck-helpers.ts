// Helper functions that Puck demo expects but aren't in the published package
export const getClassNameFactory = (componentName: string, styles: any) => {
  return (modifiers?: Record<string, boolean> | string) => {
    const baseClass = styles[componentName] || '';
    if (!modifiers) return baseClass;
    
    if (typeof modifiers === 'string') {
      return `${baseClass} ${styles[modifiers] || ''}`.trim();
    }
    
    const modifierClasses = Object.entries(modifiers)
      .filter(([_, active]) => active)
      .map(([key]) => styles[`${componentName}_${key}`] || '')
      .filter(Boolean)
      .join(' ');
    
    return `${baseClass} ${modifierClasses}`.trim();
  };
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};