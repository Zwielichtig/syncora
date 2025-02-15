// TypeScript entry point
import '../styles/app.scss';
import 'bootstrap';
import { controllerMapper } from './controllerMapper';
import '../styles/pinboard.scss';
import 'bootstrap';
import { PinController } from './controller/PinController';
import { Category } from './models/Category';
import { NotePin } from './models/NotePin';
import { PinType } from './models/PinType';
import { ToDoEntry } from './models/ToDoEntry';
import { ToDoPin } from './models/ToDoPin';



const pinType = new PinType(1, 'Notiz')
const category = new Category(1, 'Test Kategore', '#0097A7')

const pin = new NotePin(1, pinType, category, 'Test Notiz', 300, 300, 300, 200, 'Hallo, dies ist ein Test.')
pin.buildPin()


const toDoEntry1 = new ToDoEntry(1, 1, null, true, 'erste Aufgabe')
const toDoEntry2 = new ToDoEntry(2, 2, new Date("2025-04-01"), false, 'zweite Aufgabe')
const toDoEntry3 = new ToDoEntry(3, 3, null, false, 'dritte Aufgabe')

const entries = []
entries.push(toDoEntry1)
entries.push(toDoEntry2)
entries.push(toDoEntry3)
const pinType2 = new PinType(2, 'To-Do')

const toDoPin = new ToDoPin(2, pinType2, category, 'To Do Notiz', 700, 300, 300, 200, entries)
toDoPin.buildPin()




document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.pageType;
    const ControllerClass = controllerMapper[page];

    if (ControllerClass) {
        const controller = new ControllerClass();
        controller.init();
    }
});