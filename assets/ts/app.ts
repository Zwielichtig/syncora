// TypeScript entry point
import '../styles/app.scss';
import 'bootstrap';
import { controllerMapper } from './controllerMapper';
import '../styles/pinboard.scss';
import { PinController } from './controller/PinController';



document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.pageType;
    const ControllerClass = controllerMapper[page];

    if (ControllerClass) {
        const controller = new ControllerClass();
        controller.init();
    }
});