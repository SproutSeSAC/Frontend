export interface CalendarList {
  etag: string;
  items: Calendar[];
  primary: boolean;
  kind: string;
  nextSyncToken: string;
}

export interface Calendar {
  accessRole: AccessRole;
  backgroundColor: string;
  colorId: string;
  conferenceProperties: AllowedConferenceSolutions;
  defaultReminders: Reminder[];
  description: string;
  etag: string;
  foregroundColor: string;
  id: string;
  kind: string;
  notificationSettings: NotificationSettings[];
  primary: boolean;
  selected: true;
  summary: string;
  summaryOverride: string;
  timeZone: string;
  deleted: boolean;
  location: string;
  hidden: boolean;
}

export type AccessRole = 'freeBusyReader' | 'reader' | 'writer' | 'owner';

export type AllowedConferenceSolutions = {
  allowedConferenceSolutionTypes:
    | 'eventHangout'
    | 'eventNamedHangout'
    | 'hangoutsMeet';
};

export type Reminder = {
  method: 'popup' | 'email';
  minutes: number;
};

export type NotificationSettings = {
  notifications: {
    type:
      | 'agenda'
      | 'eventCreation'
      | 'eventChange'
      | 'eventCancellation'
      | 'eventResponse';
    method: 'email';
  };
};

export interface CalenderEvents {
  accessRole: AccessRole;
  defaultReminders: Reminder;
  description?: string;
  kind: string;
  etag: string;
  summary: string;
  updated: string;
  timeZone: string;
  items: Event[];
  nextSyncToken?: string;
}

export interface Event {
  kind: string;
  etag: string;
  id: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  htmlLink: string;
  created: string;
  updated: string;
  summary: string;
  description?: string;
  location?: string;
  creator: EventCreator;
  organizer: EventOrganizer;
  start: EventDateTime;
  end: EventDateTime;
  attendees?: EventAttendee[];
  reminders?: EventReminders;
  transparency?: 'transparent';
  iCalUID?: string;
  sequence?: number;
  reminders: {
    useDefault: boolean;
  };
  eventType: 'default';
}

export interface EventCreator {
  email: string;
  displayName?: string;
  self: boolean;
}

export interface EventOrganizer {
  email: string;
  displayName?: string;
  self: boolean;
}

export interface EventDateTime {
  date: string;
  dateTime: string;
  timeZone: string;
}

export interface EventAttendee {
  email: string;
  displayName?: string;
  responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction';
}

export interface EventReminders {
  useDefault: boolean;
  overrides?: ReminderOverride[];
}

export interface ReminderOverride {
  method: 'email' | 'popup';
  minutes: number;
}
