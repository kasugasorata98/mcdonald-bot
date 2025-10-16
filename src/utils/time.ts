import moment from "moment";

export function formatTime(date: Date): string {
  return moment(date).format("HH:mm:ss");
}

export function nowTime(): string {
  return moment().format("HH:mm:ss");
}
