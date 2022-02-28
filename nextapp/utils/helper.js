export const convertToNumber = (text) => {
  return text?.replaceAll("€", "");
};

export const converToCurrencyText = (number) => {
  return `${number} €`;
};
