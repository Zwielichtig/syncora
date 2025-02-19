import { HTMLSnippets } from "../ressources/HTMLSnippets";
import { Category } from "./Category";
import { Pin } from "./Pin";
import { PinType } from "./PinType";

export class AppointmentPin extends Pin {

    contentId: number
    title: string
    beginAt: Date
    endAt: Date

    public static instances: AppointmentPin[] = []

    datetimeSpan: HTMLSpanElement



    public static getImagePinInstance(id: number): AppointmentPin {
        for (const pin of this.instances) {
            if (pin.id == id) {
                return pin
            }
        }
        return null;
    }

    public static initAppointmentPinInstance(data: any) : AppointmentPin {
        const type = PinType.getPinTypeInstance(data.type)
        const category = Category.getCategoryInstance(data.category)

        const beginAt = new Date(data['pinContent']['beginAt']['date'])
        const endAt = new Date(data['pinContent']['endAt']['date'])
        const pin = new AppointmentPin(data.id, type, category, data.title, data.posX, data.posY, data.width, data.height, data['pinContent']['id'], beginAt, endAt)
        pin.saved = true;
        this.instances.push(pin)
        return pin
    }

    constructor(id: number, type: PinType, category: Category, title: string, posX: number, posY: number, width: number, height: number, contentId: number, beginAt?: Date, endAt?: Date) {
        super(id, type, category, title, posX, posY, width, height)
        this.contentId = contentId
        this.beginAt = beginAt || new Date()
        this.endAt = endAt || new Date(Date.now() + 3600000)
    }


    public buildPinContent(): HTMLDivElement {
        const parser = new DOMParser()
        const html = parser.parseFromString(HTMLSnippets.APPOINTMENT_CONTENT, 'text/html')
        const appointmentContainer = html.querySelector('.appointment') as HTMLDivElement

        const titleElement = appointmentContainer.querySelector('.appointment-title')
        const beginElement = appointmentContainer.querySelector('.appointment-begin')
        const endElement = appointmentContainer.querySelector('.appointment-end')

        if (titleElement) titleElement.textContent = this.title
        if (beginElement) beginElement.textContent = `Von: ${this.beginAt.toLocaleString()}`
        if (endElement) endElement.textContent = `Bis: ${this.endAt.toLocaleString()}`

        return appointmentContainer
    }

    public buildEditorContent() : HTMLDivElement{
        const parser = new DOMParser()
        const htmlEntry = parser.parseFromString(HTMLSnippets.APPOINTMENT_EDITOR, 'text/html')

        const entryEditor = htmlEntry.querySelector('.appointment-editor') as HTMLDivElement

        //datetime
        const titleInput = htmlEntry.querySelector('.appointment-title-input') as HTMLInputElement
        const beginInput = htmlEntry.querySelector('.appointment-begin-input') as HTMLInputElement
        const endInput = htmlEntry.querySelector('.appointment-end-input') as HTMLInputElement

        if (titleInput) titleInput.value = this.title || ''
        if (beginInput) beginInput.value = this.formatDateForInput(this.beginAt)
        if (endInput) endInput.value = this.formatDateForInput(this.endAt)

        return entryEditor
    }

    private formatDateForInput(date: Date): string {
        try {
            return date.toISOString().slice(0, 16)
        } catch (err) {
            console.warn('Invalid date, using current time')
            return new Date().toISOString().slice(0, 16)
        }
    }

    private onDatetimeChange(event:Event) {
        this.datetime = new Date((event.target as HTMLInputElement).value)
        this.datetimeSpan.innerHTML = this.datetime.toLocaleDateString();
    }

    public getPinContentData(): Object {
        const data = {
            id: this.contentId,
            title: this.title,
            begin_at: this.beginAt.toISOString(),
            end_at: this.endAt.toISOString()
        }
        return data
    }

    protected updatePinContent(): void {
        const titleElement = this.pinContainer.querySelector('.appointment-title')
        const beginElement = this.pinContainer.querySelector('.appointment-begin')
        const endElement = this.pinContainer.querySelector('.appointment-end')

        if (titleElement) titleElement.textContent = this.title || ''
        if (beginElement) beginElement.textContent = `Von: ${this.formatDateTime(this.beginAt)}`
        if (endElement) endElement.textContent = `Bis: ${this.formatDateTime(this.endAt)}`
    }

    private formatDateTime(date: Date): string {
        try {
            return date.toLocaleString()
        } catch (err) {
            console.warn('Invalid date, using current time')
            return new Date().toLocaleString()
        }
    }
}