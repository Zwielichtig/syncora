import { HTMLSnippets } from "../ressources/HTMLSnippets";
import { Category } from "./Category";
import { Pin } from "./Pin";
import { PinType } from "./PinType";
import { ToDoEntry } from "./ToDoEntry";

export class ToDoPin extends Pin {
    entries: ToDoEntry[]

    contentId : number


    public static instances: ToDoPin[] = []

    pinContainer: HTMLDivElement;
    todoContainer: HTMLDivElement;


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
        for (const entry of data['pinContent']['entries']) {
            entries.push(ToDoEntry.initToDoEntryInstance(entry))
        }
        const pin = new ToDoPin(data.id, type, category, data.title, data.posX, data.posY, data.width, data.height, data.contentId, entries)
        pin.saved = true;
        this.instances.push(pin)
        return pin
    }


    constructor(id: number, type: PinType, category: Category, title: string, posX: number, posY: number, width: number, height: number, contentId: number, entries: any[]) {
        super(id, type, category, title, posX, posY, width, height)
        this.contentId = contentId
        this.entries = entries.map(entry => new ToDoEntry(
            0, // id will be set by backend
            entry.content,
            entry.done,
            entry.datetime ? new Date(entry.datetime) : null
        ));
    }

    buildPinContent(): HTMLDivElement {
        const parser = new DOMParser();
        const html = parser.parseFromString(HTMLSnippets.TO_DO_CONTENT, 'text/html');
        this.todoContainer = html.querySelector('.to-do') as HTMLDivElement;

        // Create and append entries
        this.entries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'to-do-entry d-flex align-items-center mb-2';
            entryElement.innerHTML = `
                <div class="form-check">
                    <input type="checkbox" class="form-check-input" ${entry.done ? 'checked' : ''}>
                    <label class="form-check-label ms-2 ${entry.done ? 'text-decoration-line-through text-muted' : ''}">${entry.content}</label>
                </div>
                ${entry.datetime ? `<small class="text-muted ms-auto">${entry.datetime.toLocaleString()}</small>` : ''}
            `;

            // Add checkbox event listener
            const checkbox = entryElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
            const label = entryElement.querySelector('.form-check-label') as HTMLLabelElement;

            if (checkbox && label) {
                checkbox.addEventListener('change', (e) => {
                    entry.done = checkbox.checked;
                    // Update label styling
                    if (entry.done) {
                        label.classList.add('text-decoration-line-through', 'text-muted');
                    } else {
                        label.classList.remove('text-decoration-line-through', 'text-muted');
                    }
                    this.setSaved(false);
                });
            }

            this.todoContainer.appendChild(entryElement);
        });

        return this.todoContainer;
    }

    buildEditorContent(): HTMLDivElement {
        const parser = new DOMParser();
        const html = parser.parseFromString(HTMLSnippets.TO_DO_EDITOR, 'text/html');
        const todoEditor = html.querySelector('.to-do-editor') as HTMLDivElement;
        const entriesContainer = todoEditor.querySelector('.to-do-editor-entries');

        // Add existing entries to editor
        if (entriesContainer) {
            this.entries.forEach(entry => {
                const entryElement = document.createElement('div');
                entryElement.className = 'to-do-entry-editor';
                entryElement.innerHTML = `
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <input type="checkbox" class="form-check-input to-do-entry-checkbox" ${entry.done ? 'checked' : ''}>
                        <input type="text" class="form-control to-do-entry-content-input" value="${entry.content}">
                        <input type="datetime-local" class="form-control to-do-entry-datetime-input" value="${entry.datetime?.toISOString().slice(0, 16) || ''}">
                        <button type="button" class="btn to-do-entry-delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

                // Add delete functionality
                const deleteBtn = entryElement.querySelector('.to-do-entry-delete-btn');
                deleteBtn?.addEventListener('click', () => {
                    entryElement.remove();
                    this.setSaved(false);
                });

                entriesContainer.appendChild(entryElement);
            });
        }

        return todoEditor;
    }

    savePin(): void {
        throw new Error("Method not implemented.");
    }

    private addEntry () : ToDoEntry {
        this.setSaved(false)
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
        this.setSaved(false)
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

    protected updatePinContent(): void {
        if (this.todoContainer) {
            this.todoContainer.innerHTML = ''; // Clear existing entries
            this.entries.forEach(entry => {
                const entryElement = document.createElement('div');
                entryElement.className = 'to-do-entry d-flex align-items-center mb-2';
                entryElement.innerHTML = `
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" ${entry.done ? 'checked' : ''}>
                        <label class="form-check-label ms-2 ${entry.done ? 'text-decoration-line-through text-muted' : ''}">${entry.content}</label>
                    </div>
                    ${entry.datetime ? `<small class="text-muted ms-auto">${entry.datetime.toLocaleString()}</small>` : ''}
                `;

                // Add checkbox event listener
                const checkbox = entryElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
                const label = entryElement.querySelector('.form-check-label') as HTMLLabelElement;

                if (checkbox && label) {
                    checkbox.addEventListener('change', (e) => {
                        entry.done = checkbox.checked;
                        // Update label styling
                        if (entry.done) {
                            label.classList.add('text-decoration-line-through', 'text-muted');
                        } else {
                            label.classList.remove('text-decoration-line-through', 'text-muted');
                        }
                        this.setSaved(false);
                    });
                }

                this.todoContainer.appendChild(entryElement);
            });
        }
    }

}

class ToDoEntry {
    id: number;
    content: string;
    done: boolean;
    datetime: Date | null;

    constructor(id: number, content: string, done: boolean, datetime: Date | null) {
        this.id = id;
        this.content = content;
        this.done = done;
        this.datetime = datetime;
    }

    static initToDoEntryInstance(data: any): ToDoEntry {
        return new ToDoEntry(
            data.id,
            data.content,
            data.done,
            data.datetime ? new Date(data.datetime) : null
        );
    }
}