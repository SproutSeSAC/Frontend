import { RruleOptions } from '@/types';

export const createRrule = (googleRrule: string) => {
  const splittedRuleArr = googleRrule.split(':')[1].split(';');
  const rrule: RruleOptions = {};

  splittedRuleArr.forEach(item => {
    const [key, value] = item.split('=');

    switch (key) {
      case 'FREQ':
        rrule.freq = value.toLowerCase() as
          | 'daily'
          | 'weekly'
          | 'monthly'
          | 'yearly';
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
        rrule.until = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(-2)}`;
        break;
      case 'COUNT':
        rrule.count = value;
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
      default:
        break;
    }
  });

  return rrule;
};
