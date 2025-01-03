export type Calendar = {
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
};

export type Event = {
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
  recurrence?: string[];
  recurringEventId?: string;
  backgroundColor?: string;
};

export type UpdateEvent = {
  summary: string;
  start: EventDateTime;
  end: EventDateTime;
  description: string;
  location: string;
};

type AccessRole = 'freeBusyReader' | 'reader' | 'writer' | 'owner';

type AllowedConferenceSolutions = {
  allowedConferenceSolutionTypes:
    | 'eventHangout'
    | 'eventNamedHangout'
    | 'hangoutsMeet';
};

type Reminder = {
  method: 'popup' | 'email';
  minutes: number;
};

type NotificationSettings = {
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

interface EventCreator {
  email: string;
  displayName?: string;
  self: boolean;
}

interface EventOrganizer {
  email: string;
  displayName?: string;
  self: boolean;
}

interface EventDateTime {
  date: string;
  dateTime?: string;
  timeZone?: string;
}

interface EventAttendee {
  email: string;
  displayName?: string;
  responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction';
}

interface EventReminders {
  useDefault: boolean;
  overrides?: ReminderOverride[];
}

interface ReminderOverride {
  method: 'email' | 'popup';
  minutes: number;
}
