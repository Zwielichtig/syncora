import { Category } from "./Category";
import { Pin } from "./Pin";
import { PinType } from "./PinType";

export class NotePin extends Pin{
    content: string

    public static instances: NotePin[]
    
    
    public static getNotePinInstance(id: number): NotePin {
        for (const pin of this.instances) {
            if (pin.id == id) {
                return pin
            }
        }
        return null;
    }

    public static initNotePinInstance(data: {'id':number, 'type':number, 'category': number, 'title':string, 'content': string}) : NotePin {
        const type = PinType.getPinTypeInstance(data.type)
        const category = Category.getCategoryInstance(data.category)
        const pin = new NotePin(data.id, type, category, data.title, data.content)
        this.instances.push(pin)
        return pin
    }
    

    constructor(id: number, type: PinType, category: Category, title: string, content: string) {
        super(id, type, category, title)
    }


    buildPinContent(): HTMLDivElement {
        throw new Error("Method not implemented.");
    }
    savePin(): void {
        throw new Error("Method not implemented.");
    }

}