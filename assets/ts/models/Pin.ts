import { AjaxController } from "../controller/AjaxController"
import { HTMLSnippets } from "../ressources/HTMLSnippets"
import { Category } from "./Category"
import { PinType } from "./PinType"

export abstract class Pin {
    id: number
    type: PinType
    category: Category
    title: string
    posX: number
    posY: number
    width: number
    height: number

    isDragging: boolean
    dragX: number
    dragY: number

    pinContainer : HTMLDivElement
    editorModal: HTMLDivElement

    titleSpan : HTMLSpanElement
    categoryIcon: HTMLDivElement

    constructor(id: number, type: PinType, category: Category, title: string, posX: number, posY: number, width: number, height: number) {
        this.id = id
        this.type = type
        this.category = category
        this.title = title
        this.posX = posX
        this.posY = posY
        this.width = width
        this.height = height

        this.isDragging = false
    }

    public  async buildPin() { 
        this.buildEditorModal()
        console.log(this.title)

        const parser = new DOMParser();
        const html = parser.parseFromString(HTMLSnippets.PIN, 'text/html')
        this.pinContainer = html.querySelector('.pin')
        this.pinContainer.id = 'pin'+this.id

        //pin title
        this.titleSpan = this.pinContainer.querySelector('.pin-title')
        this.titleSpan.innerHTML = this.title
        
        //category icon
        this.categoryIcon = this.pinContainer.querySelector('.category-icon')
        this.categoryIcon.style.backgroundColor = this.category.color

        //edit icon
        const editIcon = this.pinContainer.querySelector('.edit-icon')
        editIcon.setAttribute('data-bs-target', `#${this.editorModal.id}`)

        //pin header
        const pinHeader = this.pinContainer.querySelector('.pin-header')
        pinHeader.addEventListener('mousedown', event => {

            this.isDragging = true;
            this.dragX = (event as MouseEvent).clientX - this.posX;
            this.dragY =  (event as MouseEvent).clientY - this.posY;
            
            document.body.addEventListener('mousemove', this.drag.bind(this))
            document.body.addEventListener('mouseup', this.stopDrag.bind(this))
            document.body.style.cursor = 'move'
        })

        //pin body
        const pinBody = this.pinContainer.querySelector('.pin-body')
        pinBody.appendChild(this.buildPinContent())
        
        this.pinContainer.style.position = "absolute";
        this.pinContainer.style.left = `${this.posX}px`;
        this.pinContainer.style.top = `${this.posY}px`;
        this.pinContainer.style.width = `${this.width}px`;
        this.pinContainer.style.height = `${this.height}px`;
        
        document.body.appendChild(this.pinContainer)
    }

    

    private buildEditorModal() {
        const parser = new DOMParser();
        const html = parser.parseFromString(HTMLSnippets.PIN_EDITOR, 'text/html')
        this.editorModal = html.querySelector('.pin-editor')
        this.editorModal.id = 'pinModal'+this.id

        //pin title
        const titelInput = this.editorModal.querySelector('.pin-title-input') as HTMLInputElement
        titelInput.value = this.title
        titelInput.addEventListener('change', e => {
            this.onTitleChange(e)
        })

        //pin category
        const categorySelect = this.editorModal.querySelector('.pin-category-select') as HTMLSelectElement
        for (const category of Category.instances) {
            const option = document.createElement('option')
            option.value = category.id.toString()
            option.innerHTML = category.name
            if (category.id == this.category.id) {
                option.selected = true
            }
            categorySelect.appendChild(option)
        }
        categorySelect.addEventListener('change', e => {
            this.onCategoryChange(e)
        })

        //pin content
        const pinContent = this.editorModal.querySelector('.pin-content-editor') as HTMLDivElement
        pinContent.append(this.buildEditorContent())       
    }

    abstract buildPinContent(): HTMLDivElement;
    abstract buildEditorContent(): HTMLDivElement;

    public displayPin() {
        this.pinContainer.style.visibility = 'visible'
    }

    public hidePin() {
        this.pinContainer.style.visibility = 'hidden'
    }

    private drag(event: MouseEvent) {

        if (!this.isDragging) return;
        this.posX = event.clientX - this.dragX
        this.posY = event.clientY - this.dragY

        this.pinContainer.style.left = `${this.posX}px`;
        this.pinContainer.style.top = `${this.posY}px`;
    }

    private stopDrag() {
        this.isDragging = false
        document.body.removeEventListener('mousemove', this.drag.bind(this))
        document.body.removeEventListener('mouseup', this.stopDrag.bind(this))
        document.body.style.cursor = 'auto'
    }

    private onTitleChange(event:Event) {
        this.title = (event.target as HTMLInputElement).value
        this.titleSpan.innerHTML = this.title
    }

    private onCategoryChange(event:Event) {
        this.category = Category.getCategoryInstance(parseInt((event.target as HTMLSelectElement).value))
        this.categoryIcon.style.backgroundColor = this.category.color
    }


    public getPinData() : Object {
        const data = {
            id: this.id,
            category: this.category.name,
            type: this.type.id,
            title: this.title,
            posX: this.posX,
            posY: this.posY,
            width: this.width,
            height: this.height,
            pin_content: this.getPinContentData()
        }
        return data
    }

    public abstract getPinContentData():Object;
}