import { Category } from "../models/Category";
import { ImagePin } from "../models/ImagePin";
import { Pin } from "../models/Pin";
import { PinType } from "../models/PinType";

export class PinController {
    private static pins : Pin[]
    private static pinTypes : PinType[]

    /**
     * entry
     */
    public init() {}

    public static loadPins() {
        //AJAX
    }

    public static buildPins() {
        for (const pin of this.pins) {
            pin.buildPin();
            pin.displayPin();
        }
    }

    public static getPins() : Pin[] {
        return PinController.pins;
    }

    public static createPin(pinTypeId: number) {

    }



}