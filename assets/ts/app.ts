// TypeScript entry point
import '../styles/app.scss';
import 'bootstrap';
import { controllerMapper } from './controllerMapper';
import { NavigationController } from './controller/NavigationController';

document.addEventListener('DOMContentLoaded', async () => {
    const page = document.body.dataset.pageType;

    if(page === 'board' || page === 'calendar') {
        NavigationController.init();
    }

    const ControllerClass = controllerMapper[page];
    if (ControllerClass) {
        const controller = new ControllerClass();
        controller.init();
    }
});