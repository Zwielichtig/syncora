import { AjaxController } from "../controller/AjaxController"
import { HTMLSnippets } from "../ressources/HTMLSnippets"
import { Category } from "./Category"
import { PinType } from "./PinType"
import { PinController } from "../controller/PinController"

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

    saved : boolean

    static instances : Pin[]=[]

    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private initialPinX: number = 0;
    private initialPinY: number = 0;
    private dragThreshold: number = 5; // Pixels to move before starting drag
    private isDraggingStarted: boolean = false;
    private isResizing: boolean = false;
    private resizeStartX: number = 0;
    private resizeStartY: number = 0;
    private initialWidth: number = 0;
    private initialHeight: number = 0;
    private readonly minWidth: number = 200;
    private readonly minHeight: number = 100;

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
        this.saved = false;

        Pin.instances.push(this)
    }

    public async buildPin() {
        console.log('Building pin:', this.id);
        this.buildEditorModal();

        const parser = new DOMParser();
        const html = parser.parseFromString(HTMLSnippets.PIN, 'text/html');
        this.pinContainer = html.querySelector('.pin');
        this.pinContainer.id = 'pin' + this.id;

        //pin title
        this.titleSpan = this.pinContainer.querySelector('.pin-title');
        this.titleSpan.innerHTML = this.title;

        //category icon
        this.categoryIcon = this.pinContainer.querySelector('.category-icon');
        this.categoryIcon.style.backgroundColor = this.category.color;

        // Initialize edit functionality
        console.log('Setting up edit button for pin:', this.id);
        const editIcon = this.pinContainer.querySelector('.edit-icon') as HTMLElement;
        if (editIcon) {
            console.log('Found edit icon for pin:', this.id);
            editIcon.addEventListener('click', (e) => {
                console.log('Edit icon clicked for pin:', this.id);
                e.preventDefault();
                e.stopPropagation();
                PinController.editPin(this);
            });
        } else {
            console.error('Edit icon not found for pin:', this.id);
        }

        //pin header
        const pinHeader = this.pinContainer.querySelector('.pin-header')
        const dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle';
        pinHeader.insertBefore(dragHandle, pinHeader.firstChild);

        // Only attach drag events to the handle
        dragHandle.addEventListener('mousedown', this.handleDragStart.bind(this));
        document.addEventListener('mousemove', this.handleDrag.bind(this));
        document.addEventListener('mouseup', this.handleDragEnd.bind(this));

        //pin body
        const pinBody = this.pinContainer.querySelector('.pin-body')
        pinBody.appendChild(this.buildPinContent())

        // Ensure the body has a minimum height for pins
        document.body.style.minHeight = '100vh';
        document.body.style.position = 'relative';

        this.pinContainer.style.position = "absolute";
        this.pinContainer.style.left = `${this.posX}px`;
        this.pinContainer.style.top = `${this.posY}px`;
        this.pinContainer.style.width = `${this.width}px`;
        this.pinContainer.style.height = `${this.height}px`;

        document.body.appendChild(this.pinContainer);
        console.log('Pin built and added to DOM:', this.id);

        // Add resize event listeners
        this.pinContainer.addEventListener('mousedown', (e: MouseEvent) => {
            const rect = this.pinContainer.getBoundingClientRect();
            const isResizeArea = (
                e.clientX > rect.right - 15 &&
                e.clientY > rect.bottom - 15
            );

            if (isResizeArea) {
                this.handleResizeStart(e);
            }
        });

        document.addEventListener('mousemove', this.handleResize.bind(this));
        document.addEventListener('mouseup', this.handleResizeEnd.bind(this));
    }

    private buildEditorModal() {
        const parser = new DOMParser();
        const html = parser.parseFromString(HTMLSnippets.PIN_EDITOR, 'text/html')
        this.editorModal = html.querySelector('.pin-editor')
        this.editorModal.id = 'pinModal'+this.id

        // Add click outside listener
        this.editorModal.addEventListener('click', (e) => {
            if (e.target === this.editorModal) {
                this.closeModal();
            }
        });

        // Add close button functionality
        const closeButton = this.editorModal.querySelector('.btn-close') as HTMLElement;
        closeButton.innerHTML = '×'; // Add visible close symbol
        closeButton.addEventListener('click', () => {
            this.closeModal();
        });

        //pin title
        const titelInput = this.editorModal.querySelector('.pin-title-input') as HTMLInputElement
        titelInput.value = this.title
        titelInput.addEventListener('change', e => {
            this.setSaved(false)
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
            this.setSaved(false)
            this.onCategoryChange(e)
        })

        //pin content
        const pinContent = this.editorModal.querySelector('.pin-content-editor') as HTMLDivElement
        pinContent.append(this.buildEditorContent())
    }

    private closeModal() {
        this.editorModal.classList.remove('show');
        this.editorModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    abstract buildPinContent(): HTMLDivElement;
    abstract buildEditorContent(): HTMLDivElement;

    public displayPin() {
        this.pinContainer.style.visibility = 'visible'
    }

    public hidePin() {
        this.pinContainer.style.visibility = 'hidden'
    }

    private handleDragStart(event: MouseEvent) {
        this.setSaved(false)
        if (event.button !== 0) return; // Only left mouse button

        this.isDragging = true;
        this.isDraggingStarted = false;
        this.dragStartX = event.clientX;
        this.dragStartY = event.clientY;
        this.initialPinX = this.posX;
        this.initialPinY = this.posY;

        // Add dragging class for visual feedback
        this.pinContainer.classList.add('pin-dragging');

        // Prevent text selection while dragging
        event.preventDefault();
    }

    private handleDrag(event: MouseEvent) {
        if (!this.isDragging) return;

        const deltaX = event.clientX - this.dragStartX;
        const deltaY = event.clientY - this.dragStartY;

        // Check if we've moved past the threshold
        if (!this.isDraggingStarted &&
            (Math.abs(deltaX) > this.dragThreshold ||
             Math.abs(deltaY) > this.dragThreshold)) {
            this.isDraggingStarted = true;
            document.body.style.cursor = 'grabbing';
        }

        if (this.isDraggingStarted) {
            this.posX = this.initialPinX + deltaX;
            this.posY = this.initialPinY + deltaY;

            // Get scrolled position
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

            // Calculate bounds including scroll position
            const bounds = document.body.getBoundingClientRect();
            this.posX = Math.max(0, Math.min(this.posX, bounds.width + scrollLeft - this.pinContainer.offsetWidth));
            this.posY = Math.max(0, Math.min(this.posY, bounds.height + scrollTop - this.pinContainer.offsetHeight));

            requestAnimationFrame(() => {
                this.pinContainer.style.left = `${this.posX}px`;
                this.pinContainer.style.top = `${this.posY}px`;
            });
        }
    }

    private handleDragEnd() {
        if (!this.isDragging) return;

        this.isDragging = false;
        this.isDraggingStarted = false;
        document.body.style.cursor = 'auto';
        this.pinContainer.classList.remove('pin-dragging');

        // Save new position if dragging actually occurred
        if (this.posX !== this.initialPinX || this.posY !== this.initialPinY) {
            // Here you could add code to save the new position to your backend
            console.log('Pin position updated:', { x: this.posX, y: this.posY });
        }
    }

    private onTitleChange(event:Event) {
        this.title = (event.target as HTMLInputElement).value
        this.titleSpan.innerHTML = this.title
    }

    private onCategoryChange(event:Event) {
        this.category = Category.getCategoryInstance(parseInt((event.target as HTMLSelectElement).value))
        this.categoryIcon.style.backgroundColor = this.category.color
    }

    private handleResizeStart(event: MouseEvent) {
        this.setSaved(false)
        this.isResizing = true;
        this.resizeStartX = event.clientX;
        this.resizeStartY = event.clientY;
        this.initialWidth = this.width;
        this.initialHeight = this.height;

        this.pinContainer.classList.add('resizing');
        event.preventDefault();
        event.stopPropagation();
    }

    private handleResize(event: MouseEvent) {
        if (!this.isResizing) return;

        const deltaX = event.clientX - this.resizeStartX;
        const deltaY = event.clientY - this.resizeStartY;

        const newWidth = Math.max(this.initialWidth + deltaX, this.minWidth);
        const newHeight = Math.max(this.initialHeight + deltaY, this.minHeight);

        requestAnimationFrame(() => {
            this.width = newWidth;
            this.height = newHeight;
            this.pinContainer.style.width = `${newWidth}px`;
            this.pinContainer.style.height = `${newHeight}px`;
        });
    }

    private handleResizeEnd() {
        if (!this.isResizing) return;

        this.isResizing = false;
        this.pinContainer.classList.remove('resizing');

        if (this.width !== this.initialWidth || this.height !== this.initialHeight) {
            // Here you could add code to save the new dimensions to your backend
            console.log('Pin size updated:', { width: this.width, height: this.height });
        }
    }

    protected setSaved(saved = false) {
        this.saved = saved
    }

    public getPinData() : Object {
        var data : Record<string, any> = {
            id: this.id,
            category: this.category.id,
            type: this.type.id,
            title: this.title,
            posX: this.posX,
            posY: this.posY,
            width: this.width,
            height: this.height,
            pinContent: this.getPinContentData()
        }

        return data
    }

    protected abstract getPinContentData():Object;

    protected addEditListener() {
        console.log('Adding edit listener to pin:', this);
        try {
            this.pinContainer?.querySelector('.edit-icon')?.addEventListener('click', () => {
                console.log('Edit icon clicked for pin:', this);
                PinController.editPin(this);
            });
        } catch (err) {
            console.error('Error adding edit listener:', err);
        }
    }

    public updatePin() {
        // Update title
        if (this.titleSpan) {
            this.titleSpan.innerHTML = this.title;
        }

        // Update category color
        if (this.categoryIcon) {
            this.categoryIcon.style.backgroundColor = this.category.color;
        }

        // Update content (to be implemented by child classes)
        this.updatePinContent();
    }

    protected abstract updatePinContent(): void;
}