export const toNonAccentVietnamese = (str: string) => {
  str = str.replace(/[AÁÀÃẠÂẤẦẪẬĂẮẰẴẶ]/g, 'A');
  str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
  str = str.replace(/[EÉÈẼẸÊẾỀỄỆ]/, 'E');
  str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
  str = str.replace(/[IÍÌĨỊ]/g, 'I');
  str = str.replace(/[ìíịỉĩ]/g, 'i');
  str = str.replace(/[OÓÒÕỌÔỐỒỖỘƠỚỜỠỢ]/g, 'O');
  str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
  str = str.replace(/[UÚÙŨỤƯỨỪỮỰ]/g, 'U');
  str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
  str = str.replace(/[YÝỲỸỴ]/g, 'Y');
  str = str.replace(/[ỳýỵỷỹ]/g, 'y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/đ/g, 'd');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/[\u0300\u0301\u0303\u0309\u0323]/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/[\u02C6\u0306\u031B]/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
};
