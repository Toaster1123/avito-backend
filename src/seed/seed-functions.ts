import * as fs from 'fs';

export function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}
export function logToFile(filePath: string, data: string) {
  fs.appendFileSync(filePath, data + '\n');
}
