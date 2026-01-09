export function isWithinQuietHours(from, to) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [fromH, fromM] = from.split(":").map(Number);
  const [toH, toM] = to.split(":").map(Number);

  const fromMinutes = fromH * 60 + fromM;
  const toMinutes = toH * 60 + toM;

  if (fromMinutes > toMinutes) {
    return currentMinutes >= fromMinutes || currentMinutes <= toMinutes;
  }

  return currentMinutes >= fromMinutes && currentMinutes <= toMinutes;
}

export function getDelayMs(to) {
  const now = new Date();
  const [toH, toM] = to.split(":").map(Number);

  const end = new Date();
  end.setHours(toH, toM, 0, 0);

  if (end <= now) {
    end.setDate(end.getDate() + 1);
  }

  return end - now;
}
