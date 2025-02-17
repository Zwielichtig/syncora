import { LoginController } from "./controller/LoginController";
//import { PinController } from './controller/PinController';
import { CalendarController } from "./controller/CalendarController";

export const controllerMapper: Record<string, any> = {
    login: LoginController,
//    pin: PinController
    calendar: CalendarController
};

// default?
