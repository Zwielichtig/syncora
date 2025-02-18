import { HTMLSnippets } from "../ressources/HTMLSnippets"

export class ToDoEntry {
    id: number
    row: number
    datetime: Date | null
    checked: boolean
    content: string 
    entryContainer: HTMLDivElement

    entryEditor: HTMLDivElement

    checkbox : HTMLInputElement
    contentSpan : HTMLSpanElement
    datetimeSpan : HTMLSpanElement



    public static initToDoEntryInstance(data: any) : ToDoEntry { 

        const datetime = new Date(data.datetime['date'])
        //TODO checked
        return new ToDoEntry(data.id, data.row, datetime, false, data.content)
    }

    constructor(id: number, row: number, datetime: Date, checked: boolean, content: string) {
        this.id = id
        this.row = row
        this.datetime = datetime
        this.checked = checked
        this.content = content
    }

    public buildEntry() : HTMLDivElement{
        const parser = new DOMParser()
        const htmlEntry = parser.parseFromString(HTMLSnippets.TO_DO_ENTRY, 'text/html')
        
        this.entryContainer = htmlEntry.querySelector('.to-do-entry')

        //checkbox
        this.checkbox = htmlEntry.querySelector('.to-do-entry-checkbox') 
        if (this.checked) {
            this.checkbox.setAttribute('checked', null)
        } else {
            this.checkbox.removeAttribute('checked')
        }
        this.checkbox.addEventListener('change', e => {
            this.onCheckboxChange(e)
        });

        //entry content
        this.contentSpan = htmlEntry.querySelector('.to-do-entry-content')
        this.contentSpan.innerHTML = this.content;

        //datetime span 
        this.datetimeSpan = htmlEntry.querySelector('.to-do-entry-datetime')
        if (this.datetime) {
            this.datetimeSpan.innerHTML = this.datetime.toLocaleDateString()
        }
       
        return this.entryContainer
    }

    public buildEntryEditor() : HTMLDivElement{
        const parser = new DOMParser()
        const htmlEntry = parser.parseFromString(HTMLSnippets.TO_DO_ENTRY_EDITOR, 'text/html')
        
        this.entryEditor = htmlEntry.querySelector('.to-do-entry-editor') as HTMLDivElement
        
        //checkbox
        const checkbox = htmlEntry.querySelector('.to-do-entry-checkbox') as HTMLInputElement
        if (this.checked) {
            checkbox.setAttribute('checked', null)
        }
        checkbox.addEventListener('change', e => {
            this.onCheckboxChange(e)
        });

        //entry content
        const contentInput = htmlEntry.querySelector('.to-do-entry-content-input') as HTMLInputElement
        contentInput.value = this.content
        contentInput.addEventListener('change', e => {
            this.onContentChange(e)
        })

        //datetime
        const datetimeInput = htmlEntry.querySelector('.to-do-entry-datetime-input') as HTMLInputElement
        if (this.datetime) {
            datetimeInput.value = this.datetime.toISOString().slice(0, 16);
        }
        datetimeInput.addEventListener('change', e => {
            this.onDatetimeChange(e)
        })

        return this.entryEditor
    }

    private onCheckboxChange(event: Event) {
        console.log((event.target as HTMLInputElement).checked)
        this.checked = (event.target as HTMLInputElement).checked
        if (this.checked) {
            this.checkbox.setAttribute('checked', null)
        } else {
            this.checkbox.removeAttribute('checked')
        }
        
    }

    private onContentChange(event: Event) {
        this.content = (event.target as HTMLInputElement).value
        this.contentSpan.innerHTML = this.content
    }

    private onDatetimeChange(event: Event) {
        this.datetime = new Date((event.target as HTMLInputElement).value)
        this.datetimeSpan.innerHTML = this.datetime.toLocaleDateString() 
    }

    public getEntryData(): Object {
        const data = {
            id: this.id,
            row: this.row,
            content: this.content,
            datetime: this.datetime,
            checked: this.checked
        }
        return data
    }


    
}