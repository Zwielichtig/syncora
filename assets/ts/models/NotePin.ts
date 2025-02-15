import { HTMLSnippets } from "../ressources/HTMLSnippets";
import { Category } from "./Category";
import { Pin } from "./Pin";
import { PinType } from "./PinType";

export class NotePin extends Pin{
    content: string

    public static instances: NotePin[]

    contentArea : HTMLParagraphElement
    
    
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
        const parser = new DOMParser()
        const htmlNoteContent = parser.parseFromString(HTMLSnippets.NOTE_CONTENT, 'text/html')
        const noteContainer = htmlNoteContent.querySelector('.note') as HTMLDivElement
        this.contentArea =  noteContainer.querySelector('.note-content')
        this.contentArea.innerHTML = this.content

        return noteContainer
    }

    buildEditorContent(): HTMLDivElement {
        const parser = new DOMParser()
        const html = parser.parseFromString(HTMLSnippets.NOTE_CONTENT_EDITOR, 'text/html')
        const noteEditor = html.querySelector('.note-editor') as HTMLDivElement

        const contentTextarea = noteEditor.querySelector('.note-content-input') as HTMLTextAreaElement
        contentTextarea.innerHTML = this.content
        contentTextarea.addEventListener('change', e => {
            this.onContentChange(e)
        })

        console.log(noteEditor)
        return noteEditor
    }

    savePin(): void {
        throw new Error("Method not implemented.");
    }

    private onContentChange(event:Event) {
        this.content = (event.target as HTMLTextAreaElement).value
        this.contentArea.innerHTML = this.content
    }

}