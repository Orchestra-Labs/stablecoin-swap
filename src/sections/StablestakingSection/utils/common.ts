export const formatDuration = (input: string): string => {
  const seconds = parseInt(input.replace('s', ''), 10);

  if (isNaN(seconds)) return '';

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);

  if (seconds < 3600) {
    return `${minutes} min`;
  }
  if (seconds < 86400) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  return `${days} day${days !== 1 ? 's' : ''}`;
};
