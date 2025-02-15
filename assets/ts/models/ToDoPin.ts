import { HTMLSnippets } from "../ressources/HTMLSnippets";
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

    public static initToDoPinInstance(data: any) : ToDoPin {
        const type = PinType.getPinTypeInstance(data.type)
        const category = Category.getCategoryInstance(data.category)
        const entries = []
        for (const entry of data.entries) {
            entries.push(ToDoEntry.initToDoEntryInstance(data.entries))
        }
        const pin = new ToDoPin(data.id, type, category, data.title, data.posX, data.posY, data.width, data.height, entries)
        this.instances.push(pin)
        return pin
    }


    constructor(id: number, type: PinType, category: Category, title: string, posX: number, posY: number, width: number, height: number, entries: ToDoEntry[]) {
        super(id, type, category, title, posX, posY, width, height)
        this.entries = entries
    }

    buildPinContent(): HTMLDivElement {
        const pinContent = document.createElement('div')
        const parser = new DOMParser();
        for (const entry of this.entries) {
            this.pinContainer.appendChild(entry.buildEntry())
        }
        return pinContent;
    }

    buildEditorContent(): HTMLDivElement {
        const editorContent = document.createElement('div')
        for (const entry of this.entries) {
            editorContent.appendChild(entry.buildEntryEditor())
        }
        return editorContent;
    }

    savePin(): void {
        throw new Error("Method not implemented.");
    }
    
}