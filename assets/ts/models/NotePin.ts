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

    public static initNotePinInstance(data: any) : NotePin {
        const type = PinType.getPinTypeInstance(data.type)
        const category = Category.getCategoryInstance(data.category)
        const pin = new NotePin(data.id, type, category, data.title, data.posX, data.posY, data.width, data.height, data.content)
        this.instances.push(pin)
        return pin
    }
    

    constructor(id: number, type: PinType, category: Category, title: string, posX: number, posY: number, width: number, height: number, content: string) {
        super(id, type, category, title, posX, posY, width, height)
        this.content = content
    }


    buildPinContent(): HTMLDivElement {
        const pinContent = document.createElement('div')
        const text = document.createElement('p')
        text.innerHTML = this.content
        pinContent.appendChild(text)
        return pinContent
    }
    savePin(): void {
        throw new Error("Method not implemented.");
    }

}