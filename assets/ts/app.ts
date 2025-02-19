// TypeScript entry point
import '../styles/app.scss';
import 'bootstrap';
import { controllerMapper } from './controllerMapper';
import { PinController } from './controller/PinController';
import { AjaxController } from './controller/AjaxController';

document.addEventListener('DOMContentLoaded', async () => {
    const page = document.body.dataset.pageType;
    console.log('Current page type:', page); // Debug log

    if (page === 'board') {
        await AjaxController.getPinTypes();
        await AjaxController.getUserCategories();
        await PinController.init();

        // Only add save button listener on board page
        const saveButton = document.getElementById("saveAllBtn") as HTMLButtonElement;
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                PinController.saveAll();
            });
        }
    }

    const ControllerClass = controllerMapper[page];
    if (ControllerClass) {
        const controller = new ControllerClass();
        controller.init();
    }
});