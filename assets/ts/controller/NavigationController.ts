import { AjaxController } from "./AjaxController";

export class NavigationController {
    private categoryForm: HTMLFormElement;
    private categoryList: HTMLElement;
    private categories: any;
    private modal: HTMLElement;

    init() {
        this.categoryForm = document.getElementById('categoryForm') as HTMLFormElement;
        this.categoryList = document.querySelector('.category-items');
        this.modal = document.getElementById('categoriesModal');

        if (this.categoryForm && this.categoryList) {
            this.setupCategoryForm();
            this.loadCategories();

            // Add modal event listener to refresh categories when opened
            this.modal?.addEventListener('show.bs.modal', () => {
                this.loadCategories();
            });
        }
    }

    private setupCategoryForm() {
        const createButton = document.getElementById('createCategoryBtn');

        createButton?.addEventListener('click', async () => {
            const nameInput = document.getElementById('categoryName') as HTMLInputElement;
            const colorInput = document.getElementById('categoryColor') as HTMLInputElement;

            if (nameInput.value.trim()) {
                try {
                    await AjaxController.createCategory(nameInput.value, colorInput.value);

                    // Reset form
                    nameInput.value = '';
                    colorInput.value = '#d1c1e4';

                    // Show success feedback
                    const feedback = document.createElement('div');
                    feedback.className = 'alert alert-success mt-2';
                    feedback.textContent = 'Kategorie erfolgreich erstellt';
                    this.categoryForm.appendChild(feedback);

                    // Remove feedback after 2 seconds
                    setTimeout(() => {
                        feedback.remove();
                    }, 2000);

                    // Refresh the categories list
                    await this.loadCategories();

                } catch (error) {
                    console.error('Error creating category:', error);

                    // Show error feedback
                    const feedback = document.createElement('div');
                    feedback.className = 'alert alert-danger mt-2';
                    feedback.textContent = 'Fehler beim Erstellen der Kategorie';
                    this.categoryForm.appendChild(feedback);

                    setTimeout(() => {
                        feedback.remove();
                    }, 2000);
                }
            }
        });
    }

    private async loadCategories() {
        try {
            const data = await AjaxController.getUserCategories();
            this.categories = data;
            this.renderCategories();
        } catch (error) {
            console.error('Error loading categories:', error);

            // Show error in the category list
            if (this.categoryList) {
                this.categoryList.innerHTML = `
                    <div class="alert alert-danger">
                        Fehler beim Laden der Kategorien
                    </div>
                `;
            }
        }
    }

    private async deleteCategory(id: number) {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                this.categories = this.categories.filter(cat => cat.id !== id);
                this.renderCategories();
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }

    private renderCategories() {
        if (!this.categoryList) return;

        this.categoryList.innerHTML = this.categories.map(category => `
            <div class="category-item" data-id="${category.id}">
                <div class="category-color" style="background-color: ${category.color}"></div>
                <span class="category-name">${category.name}</span>
                <button class="category-delete" title="Löschen">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');

        // Add delete event listeners
        this.categoryList.querySelectorAll('.category-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const categoryItem = (e.target as Element).closest('.category-item');
                const categoryId = categoryItem?.getAttribute('data-id');
                if (categoryId) {
                    if (AjaxController.deleteCategory(parseInt(categoryId))) {
                        categoryItem?.remove();
                    }
                }
            });
        });
    }
}