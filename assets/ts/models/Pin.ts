import { Category } from "./Category"
import { PinType } from "./PinType"

export abstract class Pin {
    id: number
    type: PinType
    category: Category
    title: string
    pinContainer : HTMLDivElement

    constructor(id: number, type: PinType, category: Category, title: string) {
        this.id = id
        this.type = type
        this.category = category
        this.title = title
    }

    public buildPin() {
        this.pinContainer = document.createElement('div');
        this.pinContainer.classList.add('pin')
        const header = document.createElement('div');
        header.classList.add('header')
        const categoryIcon = document.createElement('div');
        categoryIcon.classList.add('icon')
        const titel = document.createElement('span');
        titel.innerHTML = this.title;

        header.appendChild(categoryIcon);
        header.appendChild(titel);

        this.pinContainer.appendChild(header);
        this.pinContainer.appendChild(this.buildPinContent());

        

        this.hidePin()
        document.body.appendChild(this.pinContainer)
    }

    public displayPin() {
        this.pinContainer.style.visibility = 'visible'
    }

    public hidePin() {
        this.pinContainer.style.visibility = 'hidden'
    }

    
    abstract buildPinContent(): HTMLDivElement;
    abstract savePin(): void;



}