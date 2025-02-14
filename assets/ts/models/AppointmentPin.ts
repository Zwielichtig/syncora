import { Category } from "./Category";
import { Pin } from "./Pin";
import { PinType } from "./PinType";

export class AppointmentPin extends Pin {
    datetime: Date

    public static instances: AppointmentPin[]

    public static getImagePinInstance(id: number): AppointmentPin {
        for (const pin of this.instances) {
            if (pin.id == id) {
                return pin
            }
        }
        return null;
    }

    public static initImagePinInstance(data: any) : AppointmentPin {
        const type = PinType.getPinTypeInstance(data.type)
        const category = Category.getCategoryInstance(data.category)
        const datetime = new Date(data.datetime)
        const pin = new AppointmentPin(data.id, type, category, data.title, data.posX, data.posY, data.width, data.height, datetime)
        this.instances.push(pin)
        return pin
    }

    constructor(id: number, type: PinType, category: Category, title: string, posX: number, posY: number, width: number, height: number, datetime: Date) {
        super(id, type, category, title, posX, posY, width, height)
        this.datetime = datetime
    }

    

    buildPinContent(): HTMLDivElement {
        return null;
        
    }

    savePin(): void {
        throw new Error("Method not implemented.");
    }
    
}