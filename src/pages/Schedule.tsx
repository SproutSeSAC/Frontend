import { useGetUserProfile } from '@/services/auth/authQueries';

import Header from '@/layouts/Header';
import MainView from '@/layouts/MainView';

import Calendar from '@/components/schedule/Calendar';

export default function Schedule() {
  // const currentCalendar = useAtomValue(calendarAtom);
  const { data: userProfile } = useGetUserProfile();

  // const {
  //   data: calendarList,
  //   isLoading: isCalendarListLoading, //
  // } = useGetCalendarList();

  // const {
  //   data: eventList,
  //   isLoading: isEventListLoading, //
  // } = useGetCalendarEvents(currentCalendar?.id);

  // if (isLoading || isCalendarListLoading || isEventListLoading) return null;

  // const fullCalendarEvents = eventList?.items.map(event => ({
  //   title: event.summary,
  //   start: event.start.dateTime || event.start.date,
  //   end: event.end.dateTime || event.end.date,
  //   id: event.id,
  // }));

  // console.log(calendarList);

  return (
    <MainView>
      <Header
        title={`${userProfile?.name} 스프님 새싹 일정`}
        highlight="새싹"
      />

      {/* <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <AuthCalendar />
          <SubscribeCalendar />
        </div>
        <div className="flex gap-2">
          <span className="text-gray2">{userProfile?.campusName} 캠퍼스</span>
          <span className="text-gray2">|</span>
          <span>{userProfile?.courseTitle}</span>
        </div>
      </div> */}

      {/* {calendarList && <SelectCalendar calendarList={calendarList.items} />} */}
      <div className="h-full w-full">
        <Calendar
          events={[
            { title: '회의', start: '2024-10-05', end: '2024-10-05', id: '1' },
            {
              title: '세미나',
              start: '2024-10-10',
              end: '2024-10-14',
              id: '2',
            },
          ]}
        />
      </div>
    </MainView>
  );
}
