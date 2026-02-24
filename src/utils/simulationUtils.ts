export const generateRandomNormal = (mean: number, stdDev: number): number => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('zh-TW').format(num);
};

export const formatMoney = (num: number): string => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '億';
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(2) + '萬';
  }
  return num.toFixed(2);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const addMinutes = (time: string, minutes: number): string => {
  const [h, m] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + minutes);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};
