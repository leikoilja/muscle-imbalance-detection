import moment from "moment";

const pad2 = (number) => (number < 10 ? "0" : "") + number;

const baseConversion = (unixTimestamp) => {
  const a = new Date(unixTimestamp * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = a.getFullYear();
  const month = months[a.getMonth()];
  const date = pad2(a.getDate());
  const hour = pad2(a.getHours());
  const min = pad2(a.getMinutes());
  const sec = pad2(a.getSeconds());
  const time = `${date} ${month} ${year} ${hour}:${min}:${sec}`;
  return time;
};

export function unixTimestampToDate(unixTimestamp) {
  return baseConversion(unixTimestamp);
}

export function unixTimestampToDateNoSeconds(unixTimestamp) {
  const time = baseConversion(unixTimestamp);
  return time.slice(0, time.length - 3);
}

export function unixTimestampToDateNoDate(unixTimestamp) {
  const time = baseConversion(unixTimestamp);
  return time.slice(12, time.length);
}

const timeFormat = "YYYY-MM-DD HH:mm";

export function ISOtimestampToString(ISOtimestamp) {
  return moment(ISOtimestamp).format(timeFormat);
}
