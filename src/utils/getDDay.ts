export const getDDay = (deadline: string) => {
  const today = new Date();
  const maxTime = new Date(deadline);
  const diff = +maxTime - +today;
  const diffDay = Math.floor(diff / (1000 * 60 * 60 * 24));
  return diffDay + 1;
};
