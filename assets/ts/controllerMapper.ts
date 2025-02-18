import { LoginController } from "./controller/LoginController";
//import { PinController } from './controller/PinController';
import { CalendarController } from "./controller/CalendarController";
import { NavigationController } from "./controller/NavigationController";

export const controllerMapper: Record<string, any> = {
    login: LoginController,
//    pin: PinController
    calendar: CalendarController,
    navigation: NavigationController,
};
