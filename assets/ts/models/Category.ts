export class Category {
    id: number
    name: string
    color: string

    public static instances: Category[] = []


    public static getCategoryInstance(id: number): Category {
        for (const category of this.instances) {
            if (category.id == id) {
                return category
            }
        }
        return null;
    }

    public static initCategoryInstance(data: {'id':number, 'name':string, 'color': string}) : Category {
        const category = new Category(data.id, data.name, data.color)
        this.instances.push(category)
        return category
    }

    constructor(id: number, name: string, color: string) {
        this.id = id
        this.name = name
        this.color = color

        Category.instances.push(this)
    }  
}