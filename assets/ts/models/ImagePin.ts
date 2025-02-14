import { Category } from './Category';
import { Pin } from './Pin';
import { PinType } from './PinType';

export class ImagePin extends Pin{
    imagePath: string
    image: HTMLImageElement

    public static instances: ImagePin[]

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

    private constructor(id: number, type: PinType, category: Category, title: string, posX: number, posY: number, width: number, height: number, imagePath: string) {
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
                    //TODO no Image icon
                    console.error(err)
                });
        }
        pinContent.innerHTML = "hallo"
        return pinContent;
    }

    savePin(): void {
        throw new Error("Method not implemented.");
    }



    private loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                this.image = img;
                resolve(img);
            }
                
            img.onerror = () => reject(new Error(`Fehler beim Laden des Bildes: ${url}`));
            img.src = url;
        });
    }
    
}