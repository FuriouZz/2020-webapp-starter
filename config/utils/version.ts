export function version() {
  const d = new Date()

  const date = d.getDate()
  const date_str = date < 10 ? "0"+date : ""+date

  const month = (d.getMonth() + 1)
  const month_str = month < 10 ? "0"+month : ""+month

  const hour = d.getHours()
  const hour_str = hour < 10 ? "0"+hour : ""+hour

  const minute = d.getMinutes()
  const minute_str = minute < 10 ? "0"+minute : ""+minute

  const second = d.getSeconds()
  const second_str = second < 10 ? "0"+second : ""+second

  const year_str = d.getFullYear().toString()

  return year_str + month_str + date_str + hour_str + minute_str + second_str
}