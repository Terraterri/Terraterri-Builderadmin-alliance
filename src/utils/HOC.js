export const findObjFromArr = (arr, value, key) => {
  return arr.find((each) => {
    if (each[key] == value) {
      return each;
    }
  });
};
