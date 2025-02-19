import { LoginController } from "./controller/LoginController";
import { BoardController } from './controller/BoardController';
import { CalendarController } from "./controller/CalendarController";
import { NavigationController } from "./controller/NavigationController";

export const controllerMapper: Record<string, any> = {
    login: LoginController,
    board: BoardController,
    calendar: CalendarController,
    navigation: NavigationController,
};
