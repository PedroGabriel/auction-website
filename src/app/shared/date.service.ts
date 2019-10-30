import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
  constructor() {}

  percentage(start: number, now: number): number {
    // start = start/1000;
    const end = start + (60 * 60 * 24 * 21); // 7 days
    let percentage_complete = ((now - start) / (end - start)) * 100;
    if (percentage_complete > 100) {
      percentage_complete = 100;
    }
    return percentage_complete;
  }
}
