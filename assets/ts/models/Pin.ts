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

    public buildPin() {
        this.pinContainer = document.createElement('div');
        this.pinContainer.classList.add('pin')
        const header = document.createElement('div');
        header.classList.add('header')
        const categoryIcon = document.createElement('div');
        categoryIcon.classList.add('icon')
        categoryIcon.style.backgroundColor = this.category.color;
        const titel = document.createElement('span');
        titel.innerHTML = this.title;

        header.appendChild(categoryIcon);
        header.appendChild(titel);

        this.pinContainer.appendChild(header);
        this.pinContainer.appendChild(this.buildPinContent());

        this.pinContainer.style.position = "absolute";
        this.pinContainer.style.left = `${this.posX}px`;
        this.pinContainer.style.top = `${this.posY}px`;
        this.pinContainer.style.width = `${this.width}px`;
        this.pinContainer.style.height = `${this.height}px`;

        
        header.addEventListener('mousedown', event => {

            this.isDragging = true;
            this.dragX = event.clientX - this.posX;
            this.dragY = event.clientY - this.posY;
            
            document.body.addEventListener('mousemove', this.drag.bind(this))
            document.body.addEventListener('mouseup', this.stopDrag.bind(this))
            document.body.style.cursor = 'move'
        })

        
        document.body.appendChild(this.pinContainer)
    }

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

    
    abstract buildPinContent(): HTMLDivElement;
    abstract savePin(): void;



}