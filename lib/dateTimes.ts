// lib/dateTimes.ts
export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return "Selamat Pagi";
  } else if (hour < 15) {
    return "Selamat Siang";
  } else if (hour < 19) {
    return "Selamat Sore";
  } else {
    return "Selamat Malam";
  }
}