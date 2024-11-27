import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ChangeDetectorRef,
  Inject,
  OnDestroy
} from "@angular/core";
import { MatCalendar, MatDatepicker } from "@angular/material/datepicker";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats
} from "@angular/material/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


/** Custom header component for datepicker. */
@Component({
  selector: "custom-date",
  templateUrl: './custom-date-header.html',
  styleUrls: ['./custom-date-header.scss']
})

export class CustomDate implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    private _datePicker: MatDatepicker<any>,
    private _calendar: MatCalendar<any>,
    private _dateAdapter: DateAdapter<any>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cdr: ChangeDetectorRef
  ) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  public todayClicked() {
    this._calendar.activeDate =
      this._dateAdapter.today();
      this._calendar._dateSelected(this._calendar.activeDate);
      this._datePicker.select(this._dateAdapter.today());
      this._datePicker.close();
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .format(
        this._calendar.activeDate,
        this._dateFormats.display.monthYearLabel
      )
      .toLocaleUpperCase();
  }

  previousClicked(mode: "month" | "year") {
    this._calendar.activeDate =
      mode === "month"
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: "month" | "year") {
    this._calendar.activeDate =
      mode === "month"
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }

   setPredefinedDate(dateType: string) {
    const today = new Date();
    let calculatedDate: Date;

    switch (dateType) {
      case 'today':
        calculatedDate = new Date();  // Set to today's date
        break;

      case 'nextMonday':
        calculatedDate = this.getNextDayOfWeek(today, 1);  // Next Monday
        break;

      case 'nextTuesday':
        calculatedDate = this.getNextDayOfWeek(today, 2);  // Next Tuesday
        break;

      case 'nextWeek':
        calculatedDate = new Date(today);
        calculatedDate.setDate(today.getDate() + 7);  // Add 7 days to today's date
        break;

      default:
        calculatedDate = today;  // Default is today's date
    }
    this._datePicker.select(calculatedDate);
  }

   private getNextDayOfWeek(date: Date, dayOfWeek: number): Date {
    const resultDate = new Date(date);
    const currentDay = resultDate.getDay();
    const daysToAdd = (dayOfWeek + 7 - currentDay) % 7;
    resultDate.setDate(resultDate.getDate() + daysToAdd);  // Set the date to the next specific day
    return resultDate;
  }
}