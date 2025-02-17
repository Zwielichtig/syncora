import { HTMLSnippets } from '../ressources/HTMLSnippets';
import { Category } from './Category';
import { Pin } from './Pin';
import { PinType } from './PinType';

export class ImagePin extends Pin{
    
    imagePath: string
    image: HTMLImageElement

    public static instances: ImagePin[]

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
        const pin = new ImagePin(data.id, type, category, data.title, data.posX, data.posY, data.width, data.height, data.image_path)
        this.instances.push(pin)
        return pin
    }

    constructor(id: number, type: PinType, category: Category, title: string, posX: number, posY: number, width: number, height: number, imagePath: string) {
        super(id, type, category, title, posX, posY, width, height)
        this.imagePath = imagePath
    }

    buildPinContent(): HTMLDivElement {
        const pinContent = document.createElement('div');
        if (this.imagePath) {
            this.loadImage(this.imagePath)
                .then(() =>  {
                    pinContent.appendChild(this.image);
                    })
                .catch(err => {
                    const parser = new DOMParser()
                    const html = parser.parseFromString(HTMLSnippets.IMAGE_NOT_FOUND, 'text/html')
                    pinContent.appendChild(html.querySelector('.image-not-found'))
                            
                    console.error(err)

                });
        }
        return pinContent;
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