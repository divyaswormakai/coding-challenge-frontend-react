export const convertToNumber = (text) => {
  return Number.parseFloat(
    text?.replaceAll("€", "")?.replaceAll(".", "")?.replaceAll(",", ".")?.trim()
  );
};

export const convertToCurrencyText = (number) => {
  console.log("Ead time");
  return `${number?.toLocaleString()?.replaceAll(",", ".")},00€`;
};
