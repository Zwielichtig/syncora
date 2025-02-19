import { HTMLSnippets } from "../ressources/HTMLSnippets";
import { Category } from "./Category";
import { Pin } from "./Pin";
import { PinType } from "./PinType";

export class NotePin extends Pin{
    contentId: number
    content: string
    contentArea: HTMLParagraphElement

    public static instances: NotePin[] = []

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
        const pin = new NotePin(data.id, type, category, data.title, data.posX, data.posY, data.width, data.height, data['pinContent']['id'], data['pinContent']['content'])
        this.instances.push(pin)
        pin.saved = true;
        return pin
    }

    constructor(id: number, type: PinType, category: Category, title: string, posX: number, posY: number, width: number, height: number, contentId:number, content: string) {
        super(id, type, category, title, posX, posY, width, height)
        this.contentId = contentId
        this.content = content
    }

    public buildPinContent(): HTMLDivElement {
        // console.log('Building note content for pin:', this.id);
        // console.log('Initial content:', this.content);

        const noteContent = document.createElement('div');
        noteContent.className = 'note p-3';

        const contentP = document.createElement('p');
        contentP.className = 'note-content mb-0';
        contentP.textContent = this.content;

        noteContent.appendChild(contentP);
        this.contentArea = contentP;

        // console.log('Built content element:', this.contentArea);
        // console.log('Content text:', this.contentArea.textContent);

        return noteContent;
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

        // console.log(noteEditor)
        return noteEditor
    }

    savePin(): void {
        throw new Error("Method not implemented.");
    }

    private onContentChange(event:Event) {
        this.setSaved(false)
        this.content = (event.target as HTMLTextAreaElement).value
        this.contentArea.textContent = this.content
    }

    public getPinContentData(): Object {
        const data = {
            id: this.contentId,
            content: this.content
        }
        return data
    }

    protected updatePinContent(): void {
        // console.log('NotePin updatePinContent called for pin:', this.id);
        // console.log('Content at start of update:', this.content);

        try {
            // Get the pin body
            const pinBody = this.pinContainer.querySelector('.pin-body');
            if (!pinBody) {
                throw new Error('Pin body not found');
            }

            // Create new content element
            const noteContent = document.createElement('div');
            noteContent.className = 'note p-3';

            const contentP = document.createElement('p');
            contentP.className = 'note-content mb-0';
            contentP.textContent = this.content;

            noteContent.appendChild(contentP);

            // Clear and update
            pinBody.innerHTML = '';
            pinBody.appendChild(noteContent);

            // Store reference
            this.contentArea = contentP;

            // console.log('Content element after update:', this.contentArea);
            // console.log('Content text after update:', this.contentArea.textContent);
        } catch (error) {
            console.error('Error updating note content:', error);
        }
    }

}