import { HTMLSnippets } from "../ressources/HTMLSnippets";
import { Category } from "./Category";
import { Pin } from "./Pin";
import { PinType } from "./PinType";
import { ToDoEntry } from "./ToDoEntry";

export class ToDoPin extends Pin {
    entries: ToDoEntry[]


    public static instances: ToDoPin[]

    pinContainer: HTMLDivElement;


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
        const parser = new DOMParser()
        const htmlEntry = parser.parseFromString(HTMLSnippets.TO_DO_EDITOR, 'text/html')
        
        const editorContent = htmlEntry.querySelector('.to-do-editor') as HTMLDivElement

        const editorEntries = editorContent.querySelector('.to-do-editor-entries') as HTMLDivElement
        
        for (const entry of this.entries) {
            const entryContainer = entry.buildEntryEditor()
            
            //delete
            const deleteButton = entryContainer.querySelector('.to-do-entry-delete-btn') as HTMLButtonElement
            deleteButton.addEventListener('click', () => {
                this.deleteEntry(entry.row)
            })

            editorEntries.appendChild(entryContainer)
        }

        //add
        const addButton = editorContent.querySelector('.to-do-entry-add-btn') as HTMLButtonElement
        addButton.addEventListener('click', () => {
            const newEntry = this.addEntry()
            const entryContainer = newEntry.buildEntryEditor()
            
            //delete
            const deleteButton = entryContainer.querySelector('.to-do-entry-delete-btn') as HTMLButtonElement
            deleteButton.addEventListener('click', () => {
                this.deleteEntry(newEntry.row)
            })
            editorEntries.appendChild(entryContainer)
        })

        return editorContent;
    }

    savePin(): void {
        throw new Error("Method not implemented.");
    }

    private addEntry () : ToDoEntry {
        let row = 1
        this.entries.forEach(entry => {
            if (entry.row > row) {
                row = entry.row
            }
        })
        row ++
        console.log(row)
        const newEntry = new ToDoEntry(null, row, null, false, '')
        this.entries.push(newEntry)
        this.pinContainer.appendChild(newEntry.buildEntry())
        return newEntry

    }

    private deleteEntry(row:number) {
        for (const [index, entry] of Object.entries(this.entries)) {
            if (entry.row == row) {
                entry.entryContainer.remove()
                entry.entryEditor.remove()
                this.entries.splice(parseInt(index), 1)
            } else if  (entry.row > row) {
                entry.row -= 1
            }
        }
    }

    public getPinContentData(): Object {
        let entryData : Array<Object> = []
        this.entries.forEach(entry => {
            entryData.push(entry.getEntryData())
        });
        const data = {
            entries: entryData
        }
        return data
    }
    
}