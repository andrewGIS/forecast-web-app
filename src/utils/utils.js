/**
 * 
 * @param {*} hour 
 * @returns Час в формате дополненного до двух цифр 1->01, 10-> 10
 */
// const formatHour = (hour) => {
//   return hour < 10 ? `0${hour}` : `${hour}`;
// }

/**
 * 
 * @param {*} date Дата для форматирования
 * @param {*} separator 
 * @returns Форматированнную строчку UTC часов даты в формате YYYYMMDD или YYYY-MM-DD, если указан сепаратор
 */
const formatAsUTCDate = (date, separator) => {

  let month = date.getUTCMonth() + 1;
  month = month < 10 ? `0${month}` : month.toString();

  let day = date.getUTCDate();
  day = day < 10 ? `0${day}` : day.toString();

  const constDateParts = [date.getFullYear(), month, day]
  return constDateParts.join(separator ? separator: '')

}

export {formatAsUTCDate}