// TypeScript entry point
import '../styles/app.scss';

document.addEventListener('DOMContentLoaded', () => {
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
        height: 650,
    });

    calendar.render();
});