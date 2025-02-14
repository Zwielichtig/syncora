// TypeScript entry point
import '../styles/app.scss';
import 'bootstrap';
import { controllerMapper } from './controllerMapper';
import '../styles/pinboard.scss';
import { PinController } from './controller/PinController';
import { Category } from './models/Category';
import { NotePin } from './models/NotePin';
import { PinType } from './models/PinType';


const pinType = new PinType(1, 'Notiz')
const category = new Category(1, 'Test Kategore', '#0097A7')

const pin = new NotePin(1, pinType, category, 'Test Notiz', 300, 300, 300, 200, 'Hallo, dies ist ein Test.')
pin.buildPin()




document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.pageType;
    const ControllerClass = controllerMapper[page];

    if (ControllerClass) {
        const controller = new ControllerClass();
        controller.init();
    }
});