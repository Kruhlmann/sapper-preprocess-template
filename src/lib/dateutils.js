/** @format */

export const month_names = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const weekday_names = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const sec_in_min = 60;
export const sec_in_hour = sec_in_min * 60;
export const sec_in_day = sec_in_hour * 24;
export const sec_in_week = sec_in_day * 7;
export const sec_in_month = sec_in_week * 4;
export const sec_in_year = sec_in_month * 12;

function pad_int(i) {
  return i > 9 || i < 0 ? `${i}` : `0${i}`;
}

function int_ordinal(i) {
  if (i > 3 && i < 21) {
    return 'th';
  }
  switch (i % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export function format(date_obj, format_str) {
  const year = date_obj.getFullYear();
  const month = date_obj.getMonth();
  const date = date_obj.getDate();
  const day = date_obj.getDay();
  const hour = date_obj.getHours();

  return format_str
    .split(/[/\- ]/)
    .map(token => {
      return token
        .replace(/^MMMM$/, month_names[month])
        .replace(/^MMM$/, month_names[month].substring(0, 3))
        .replace(/^MM$/, pad_int(month + 1))
        .replace(/^Mo$/, `${month + 1}${int_ordinal(month + 1)}`)
        .replace(/^DD$/, pad_int(date))
        .replace(/^Do$/, `${date}${int_ordinal(date)}`)
        .replace(/^D$/, date)
        .replace(/^YYYY$/, year)
        .replace(/^YY$/, year % 100)
        .replace(/^ORD$/, `${int_ordinal(date)}`.toUpperCase())
        .replace(/^ord$/, `${int_ordinal(date)}`.toLowerCase())
        .replace(/^dddd$/, weekday_names[day])
        .replace(/^ddd$/, weekday_names[day].substring(0, 3))
        .replace(/^dd$/, weekday_names[day].substring(0, 2))
        .replace(/^do$/, `${day}${int_ordinal(day)}`)
        .replace(/^d$/, day)
        .replace(/^HH$/, pad_int(hour))
        .replace(/^H$/, hour)
        .replace(/^hh$/, pad_int(hour % 12))
        .replace(/^h$/, hour % 12)
        .replace(/^kk$/, pad_int(hour + 1))
        .replace(/^k$/, hour + 1);
    })
    .join(' ');
}

/**
 * Builds a readable timestamp based on an amount of seconds.
 *
 * @example
 *     seconds_to_timestamp(1432); // Returns 00:23:52.
 * @example
 *     seconds_to_timestamp(90737); // Returns 1 day 01:12:17.
 * @param {number} seconds - Total seconds.
 * @returns {string} - Timestamp representation of seconds.
 */
export function seconds_to_timestamp(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds / 3600) % 24;
  seconds %= 3600;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  if (d > 0) {
    return `${d} day${d > 1 ? 's' : ''} ${pad_int(h)}:${pad_int(m)}:${pad_int(
      s,
    )}`;
  } else {
    return `${pad_int(h)}:${pad_int(m)}:${pad_int(s)}`;
  }
}

export function make_utc(date) {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  );
}

export function convert_to_utc(date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}
