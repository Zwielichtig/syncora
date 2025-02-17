import { HTMLSnippets } from "../ressources/HTMLSnippets";
import { Category } from "./Category";
import { Pin } from "./Pin";
import { PinType } from "./PinType";

export class AppointmentPin extends Pin {
    
    datetime: Date

    public static instances: AppointmentPin[]

    datetimeSpan: HTMLSpanElement



    public static getImagePinInstance(id: number): AppointmentPin {
        for (const pin of this.instances) {
            if (pin.id == id) {
                return pin
            }
        }
        return null;
    }

    public static initImagePinInstance(data: any) : AppointmentPin {
        const type = PinType.getPinTypeInstance(data.type)
        const category = Category.getCategoryInstance(data.category)
        const datetime = new Date(data.datetime)
        const pin = new AppointmentPin(data.id, type, category, data.title, data.posX, data.posY, data.width, data.height, datetime)
        this.instances.push(pin)
        return pin
    }

    constructor(id: number, type: PinType, category: Category, title: string, posX: number, posY: number, width: number, height: number, datetime: Date) {
        super(id, type, category, title, posX, posY, width, height)
        this.datetime = datetime
    }
    

    public buildPinContent(): HTMLDivElement {
        console.log(this.title)
        const parser = new DOMParser()
        const html = parser.parseFromString(HTMLSnippets.APPOINTMENT_CONTENT, 'text/html')
        const appointmentContainer = html.querySelector('.appointment') as HTMLDivElement

        //datetime span 
        this.datetimeSpan = appointmentContainer.querySelector('.appointment-datetime')
        if (this.datetime) {
            this.datetimeSpan.innerHTML = this.datetime.toLocaleDateString()
        }
        

        return appointmentContainer
    }

    public buildEditorContent() : HTMLDivElement{
        const parser = new DOMParser()
        const htmlEntry = parser.parseFromString(HTMLSnippets.APPOINTMENT_EDITOR, 'text/html')
        
        const entryEditor = htmlEntry.querySelector('.appointment-editor') as HTMLDivElement

        //datetime
        const datetimeInput = htmlEntry.querySelector('.appointment-datetime-input') as HTMLInputElement
        if (this.datetime) {
            datetimeInput.value = this.datetime.toISOString().slice(0, 16);
        }
        datetimeInput.addEventListener('change', e => {
            this.onDatetimeChange(e)
        })

        return entryEditor
    }

    private onDatetimeChange(event:Event) {
        this.datetime = new Date((event.target as HTMLInputElement).value)
        this.datetimeSpan.innerHTML = this.datetime.toLocaleDateString();
    }

    public getPinContentData(): Object {
        const data = {
            datetime: this.datetime.toISOString()
        }
        return data
    }
    
}