import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { ResourceInput } from '@fullcalendar/resource-common';
import { DateTimeFormatter, LocalDateTime, ZonedDateTime } from '@js-joda/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  resources: ResourceInput[] = [];
  currentEvents: EventApi[] = [];
  calendarInst?: Calendar;

  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'resourceTimelineDay, resourceTimelineWeek, resourceTimelineMonth'
    },
    initialView: 'resourceTimelineDay',
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    resources: this.resources,
    nowIndicator: true,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };

  ngOnInit(): void {
    const calendarEl = document.getElementById('calendar')!;
    this.calendarInst = new Calendar(calendarEl);

    for (let i = 0; i < 5; i++) {
      this.resources[i] = {
        id: `${i}`,
        title: `Stream ${i}`,
      }
    }
  }

  private get calendar(): Calendar {
    return this.calendarInst!;
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        resourceId: selectInfo.resource?.id,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
  }

  scrollToNow() {
    ////////////////////////////////////////////////////////////////////////
    // Just time
    ////////////////////////////////////////////////////////////////////////
    //const time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));

    ////////////////////////////////////////////////////////////////////////
    // ISO 8601
    ////////////////////////////////////////////////////////////////////////
    const time = ZonedDateTime.now().withFixedOffsetZone().toString();

    ////////////////////////////////////////////////////////////////////////
    // Object
    ////////////////////////////////////////////////////////////////////////
    //    const now = ZonedDateTime.now();
    //    const time = {
    //      year: now.year(),
    //      month: now.monthValue(),
    //      day: now.dayOfMonth(),
    //      hour: now.hour(),
    //      minute: now.minute(),
    //      second: now.second()
    //    };

    console.debug("Scroll to time", { time });
    this.calendar.scrollToTime(time);
  }
}
