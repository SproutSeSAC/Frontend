export const formatPhoneNumber = (phoneNumber: string) => {
  const numbers = phoneNumber.replace(/\D/g, '');

  if (numbers.length <= 11) {
    const match = numbers.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
  }
  return numbers;
};
