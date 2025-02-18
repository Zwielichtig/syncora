import { HTMLSnippets } from '../ressources/HTMLSnippets';
import { Category } from './Category';
import { Pin } from './Pin';
import { PinType } from './PinType';

export class ImagePin extends Pin{

    imagePath: string
    image: HTMLImageElement

    public static instances: ImagePin[] = []

    editorContent : HTMLDivElement

    public static getImagePinInstance(id: number): ImagePin {
        for (const pin of this.instances) {
            if (pin.id == id) {
                return pin
            }
        }
        return null;
    }

    public static initImagePinInstance(data: any) : ImagePin {
        const type = PinType.getPinTypeInstance(data.type)
        const category = Category.getCategoryInstance(data.category)
        const pin = new ImagePin(data.id, type, category, data.title, data.posX, data.posY, data.width, data.height, data.filePath)
        this.instances.push(pin)
        return pin
    }

    constructor(id: number, type: PinType, category: Category, title: string, posX: number, posY: number, width: number, height: number, imagePath: string) {
        super(id, type, category, title, posX, posY, width, height)
        this.imagePath = imagePath
    }

    buildPinContent(): HTMLDivElement {
        const pinContent = document.createElement('div');
        pinContent.className = 'image-pin-content';

        if (this.imagePath) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            this.loadImage(this.imagePath)
                .then(() => {
                    this.image.className = 'pin-image';
                    this.updateImageSize(); // Initial size
                    imageContainer.appendChild(this.image);

                    // Add resize observer
                    const resizeObserver = new ResizeObserver(() => {
                        this.updateImageSize();
                    });
                    resizeObserver.observe(this.pinContainer);

                    // Add zoom functionality
                    this.image.addEventListener('click', () => {
                        const modal = document.createElement('div');
                        modal.className = 'image-modal';
                        modal.innerHTML = `
                            <div class="image-modal-content">
                                <img src="${this.imagePath}" alt="${this.title}">
                                <button class="close-modal">&times;</button>
                            </div>
                        `;

                        modal.addEventListener('click', (e) => {
                            if (e.target === modal || (e.target as Element).classList.contains('close-modal')) {
                                modal.remove();
                            }
                        });

                        document.body.appendChild(modal);
                    });
                })
                .catch(err => {
                    const parser = new DOMParser();
                    const html = parser.parseFromString(HTMLSnippets.IMAGE_NOT_FOUND, 'text/html');
                    imageContainer.appendChild(html.querySelector('.image-not-found'));
                    console.error(err);
                });

            pinContent.appendChild(imageContainer);
        }
        return pinContent;
    }

    private updateImageSize() {
        if (this.image) {
            const containerWidth = this.pinContainer.clientWidth - 32; // Account for padding
            const containerHeight = this.pinContainer.clientHeight - 80; // Account for header and padding

            // Calculate aspect ratio
            const imageRatio = this.image.naturalWidth / this.image.naturalHeight;
            const containerRatio = containerWidth / containerHeight;

            if (imageRatio > containerRatio) {
                // Image is wider than container
                this.image.style.width = `${containerWidth}px`;
                this.image.style.height = 'auto';
            } else {
                // Image is taller than container
                this.image.style.height = `${containerHeight}px`;
                this.image.style.width = 'auto';
            }
        }
    }

    buildEditorContent(): HTMLDivElement {
        const parser = new DOMParser()
        let imageEditor : HTMLDivElement = document.createElement('div')
        // if (this.imagePath) {
        //     const html = parser.parseFromString(HTMLSnippets.IMAGE_EDITOR_FILE, 'text/html')
        //     imageEditor = html.querySelector('.image-editor')
        //     const imageInput = imageEditor.querySelector('.image-input')
        //     imageInput.addEventListener('input', event => {
        //         this.onImageInput(event)
        //     })
        // } else {
        //     const html = parser.parseFromString(HTMLSnippets.IMAGE_EDITOR_UPLOAD, 'text/html')
        // }
        return imageEditor
    }

    savePin(): void {
        throw new Error("Method not implemented.");
    }

    private onImageInput(event:Event) {
        const imgFile = (event.target as HTMLInputElement).files[0]

        const reader = new FileReader();
        reader.readAsDataURL(imgFile);
        reader.onload = function() {
            const fileData = reader.result;
        };

    }

    private onImageDelete() {

    }



    private loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                this.image = img;
                this.image.width = this.width
                resolve(img);
            }

            img.onerror = () => reject(new Error(`Fehler beim Laden des Bildes: ${url}`));
            img.src = this.imagePath;
        });
    }

    public getPinContentData(): Object {
        const data = {
            filePath: this.imagePath
        }
        return data
    }

}