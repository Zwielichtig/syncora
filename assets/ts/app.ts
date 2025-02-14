// TypeScript entry point
import '../styles/app.scss';
import { controllerMapper } from './controllerMapper';

document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.pageType;
    const ControllerClass = controllerMapper[page];

    if (ControllerClass) {
        const controller = new ControllerClass();
        controller.init();
    }
});
