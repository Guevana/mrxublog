export const getSizeClasses = (size?: string) => {
  switch (size) {
    case 'medium': return 'w-72 h-40';
    case 'large': return 'w-96 h-56';
    case 'small':
    default: return 'w-56 h-32';
  }
};

export const textLabelSizeClasses = (size?: string) => {
  switch (size) {
    case 'medium': return 'w-72 p-8';
    case 'large': return 'w-96 p-10';
    case 'small':
    default: return 'w-56 p-6';
  }
};

export const getPhotoWidthClasses = (size?: string) => {
  switch (size) {
    case 'medium': return 'w-72';
    case 'large': return 'w-96';
    case 'small':
    default: return 'w-56';
  }
};
