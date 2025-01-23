export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

export const getRandomColor = (name) => {
  const colors = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  
  // Use name to generate consistent color for same user
  const index = name?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
  return colors[index % colors.length];
}; 