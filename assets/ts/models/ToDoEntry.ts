export class ToDoEntry {
    id: number
    row: number
    datetime: Date | null
    checked: boolean
    content: string 
    entryContainer: HTMLDivElement


    public static initToDoEntryInstance(data: any) : ToDoEntry { 
        const datetime = new Date(data.datetime)
        return new ToDoEntry(data.id, data.row, datetime, data.checked, data.content)
    }

    private constructor(id: number, row: number, datetime: Date, checked: boolean, content: string) {
        this.id = id
        this.row = row
        this.datetime = datetime
        this.checked = checked
        this.content = content
    }

    public buildEntry() {
        this.entryContainer = document.createElement('div');
        const checkbox = document.createElement('input')
        
        checkbox.type = 'checkbox'
        checkbox.checked = this.checked;

        checkbox.addEventListener('change', () => {
            this.checked = checkbox.checked;
        });

        const calenderButton = document.createElement('button')
        calenderButton.addEventListener('click', event => {
            //TODO Date
        });
        

        

        
    }

    
}