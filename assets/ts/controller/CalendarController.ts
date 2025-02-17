export class CalendarController {
    init() {
        const calendarEl = document.getElementById('calendar-holder');

        const calendar = new FullCalendar.Calendar(calendarEl, {
            defaultView: 'dayGridMonth',
            editable: true,
            eventSources: [
                {
                    url: '/fc-load-events',
                    method: 'POST',
                    extraParams: {
                        filters: JSON.stringify({})
                    },
                    failure: () => {
                        // alert('There was an error while fetching FullCalendar!');
                    },
                },
            ],
            headerToolbar: {
                start: 'prev,next today',
                center: 'title',
                end: 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            timeZone: 'UTC',
            height: 750,

            eventMouseEnter: function(mouseEnterInfo) {
                let eventEl = mouseEnterInfo.el;
                eventEl.style.transform = 'scale(1.01)';
                eventEl.style.boxShadow = '0 0 10px rgba(255, 111, 97, 0.6)';
                eventEl.style.transition = 'all 0.3s ease-in-out';
            },

            eventMouseLeave: function(mouseLeaveInfo) {
                let eventEl = mouseLeaveInfo.el;
                eventEl.style.transform = 'scale(1)';
                eventEl.style.boxShadow = 'none';
            }
        });

        calendar.render();
    }
}