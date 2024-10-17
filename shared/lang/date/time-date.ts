export const isMoreThanOneDay = (date: Date, compareDate: Date) => {
  return (date.valueOf() - compareDate.valueOf()) > 86400000;
}