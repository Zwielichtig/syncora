import { Category } from "./Category";
import { Pin } from "./Pin";
import { PinType } from "./PinType";
import { ToDoEntry } from "./ToDoEntry";

export class ToDoPin extends Pin {
    entries: ToDoEntry[]


    public static instances: ToDoPin[]


    public static getToDoPinInstance(id: number): ToDoPin {
        for (const pin of this.instances) {
            if (pin.id == id) {
                return pin
            }
        }
        return null;
    }

    public static initToDoPinInstance(data: {'id':number, 'type':number, 'category': number, 'title':string, 'entries':Array<Object>}) : ToDoPin {
        const type = PinType.getPinTypeInstance(data.type)
        const category = Category.getCategoryInstance(data.category)
        const entries = []
        for (const entry of data.entries) {
            entries.push(ToDoEntry.initToDoEntryInstance(data.entries))
        }
        const pin = new ToDoPin(data.id, type, category, data.title, entries)
        this.instances.push(pin)
        return pin
    }


    constructor(id: number, type: PinType, category: Category, title: string, entries: ToDoEntry[]) {
        super(id, type, category, title)
        this.entries = entries
    }

    buildPinContent(): HTMLDivElement {
        throw new Error("Method not implemented.");
    }
    savePin(): void {
        throw new Error("Method not implemented.");
    }
    
}