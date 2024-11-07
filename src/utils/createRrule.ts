type Rrule = {
  freq: string;
  interval: number;
  byweekday: string[] | string;
  bymonthday: number[];
  until: string;
  bymonth: number[];
  bysetpos: number[] | number;
  byhour: number[];
  byminute: number[];
  bysecond: number[];
  byearday: number[];
  wkst: string;
};

export const createRrule = (googleRrule: string) => {
  const splittedRuleArr = googleRrule.split(':')[1].split(';');
  const rrule: Partial<Rrule> = {};

  splittedRuleArr.forEach(item => {
    const [key, value] = item.split('=');

    switch (key) {
      case 'FREQ':
        rrule.freq = value.toLowerCase();
        break;
      case 'INTERVAL':
        rrule.interval = parseInt(value, 10);
        break;
      case 'BYDAY':
        if (value.length === 3) {
          const week = value.slice(0, 1);
          const day = value.slice(1);
          rrule.byweekday = day.toLowerCase();
          rrule.bysetpos = parseInt(week, 10);
        } else {
          rrule.byweekday = value?.split(',')?.map(day => day.toLowerCase());
        }
        break;
      case 'BYMONTHDAY':
        rrule.bymonthday = value.split(',').map(Number);
        break;
      case 'UNTIL':
        rrule.until = `${value}`;
        break;
      case 'BYMONTH':
        rrule.bymonth = value.split(',').map(Number);
        break;
      case 'BYSETPOS':
        rrule.bysetpos = value.split(',').map(Number);
        break;
      case 'BYHOUR':
        rrule.byhour = value.split(',').map(Number);
        break;
      case 'BYMINUTE':
        rrule.byminute = value.split(',').map(Number);
        break;
      case 'BYSECOND':
        rrule.bysecond = value.split(',').map(Number);
        break;
      case 'BYYEARDAY':
        rrule.byearday = value.split(',').map(Number);
        break;
      case 'WKST':
        rrule.wkst = value.toLowerCase();
        break;
      default:
        break;
    }
  });

  return rrule;
};
