import { AppointmentPin } from "../models/AppointmentPin";
import { Category } from "../models/Category";
import { ImagePin } from "../models/ImagePin";
import { NotePin } from "../models/NotePin";
import { Pin } from "../models/Pin";
import { PinType } from "../models/PinType";
import { ToDoPin } from "../models/ToDoPin";
import { AjaxController } from "./AjaxController";

export class PinController {

    /**
     * entry
     */
    public static async init() {
        await PinController.loadPinTypes()
        await PinController.loadCategories()
        await PinController.loadPins()
        await PinController.displayPins()
    }

    private static async loadPinTypes() {
        const pinTypes = await AjaxController.getPinTypes()
        pinTypes.forEach(pinTypeData => {
            PinType.initPinTypeInstance(pinTypeData);
        });   
        console.log(PinType.instances)
    }

    private static async loadCategories() {
        const userCategories = await AjaxController.getUserCategories()
        userCategories.forEach(userCategory => {
            Category.initCategoryInstance(userCategory);
        });  
        console.log(Category.instances) 
    }

    private static async loadPins() {
        const pins = await AjaxController.getUserPins()
        pins.forEach(pin => {
            switch (pin['type']) {
                case 1:
                    //Note
                    NotePin.initNotePinInstance(pin)
                    break
                case 2:
                    //Image
                    ImagePin.initImagePinInstance(pin)
                    break
                case 3:
                    //ToDo
                    ToDoPin.initToDoPinInstance(pin)
                    break
                case 4:
                    //Appointment
                    AppointmentPin.initAppointmentPinInstance(pin)
                    break
            }
        });  
        console.log(NotePin.instances) 
        console.log(ImagePin.instances) 
        console.log(ToDoPin.instances) 
        console.log(AppointmentPin.instances) 
    }

    private static async displayPins() {
        console.log(Pin.instances)
        Pin.instances.forEach(pin => {
            pin.buildPin()
        });
    }

    public static async saveAll() {
        var pins:Pin[] = []

        Pin.instances.forEach(pin => {
            if (!pin.saved) {
                pins.push(pin)
            }
        });
        if (pins) {
            AjaxController.updateUserPins(pins)
        }
        

    }


}