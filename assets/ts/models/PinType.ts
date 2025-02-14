import { Pin } from "./Pin";

export class PinType {
    id: number
    name: string

    public static instances: PinType[]




    public static getPinTypeInstance(id: number): PinType {
        for (const pinType of this.instances) {
            if (pinType.id == id) {
                return pinType
            }
        }
        return null;
    }

    public static initPinTypeInstance(data: {'id':number, 'name':string}) : PinType{
        const pinType = new PinType( data.id, data.name)
        this.instances.push(pinType)
        return pinType
    }

    constructor(id:number, name:string) {
        this.id = id
        this.name = name
    } 



}