import { AjaxController } from "./AjaxController";

interface Category {
    id: number;
    name: string;
    color: string;
}

export class NavigationController {
    private static categoryForm: HTMLFormElement;
    private static categoryList: HTMLElement;
    private static categories: any;
    private static modal: HTMLElement;

    public static init() {
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

        // Add export appointments handler
        document.querySelector('.share-button')?.addEventListener('click', () => {
            NavigationController.exportAppointmentsToCSV();
        });

        // Keep other initialization code
        document.querySelector('.category-button')?.addEventListener('click', () => {
            NavigationController.showCategoryModal();
        });
    }

    private static setupCategoryForm() {
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

    private static async loadCategories() {
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

    private static async deleteCategory(id: number) {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                this.categories = this.categories.filter((cat: Category) => cat.id !== id);
                this.renderCategories();
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    }

    private static renderCategories() {
        if (!this.categoryList) return;

        this.categoryList.innerHTML = this.categories.map((category: Category) => `
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

    private static async exportAppointmentsToCSV() {
        try {
            const appointments = await AjaxController.getAppointmentsForExport();
            if (!appointments || appointments.length === 0) {
                alert('Keine Termine zum Exportieren vorhanden.');
                return;
            }

            // Generate UUID for iCal events
            const generateUID = () => {
                const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
                return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
            };

            // Format date and time for iCal compatibility
            const formatDateTime = (dateStr: string) => {
                const date = new Date(dateStr);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = '00';

                return `${year}${month}${day}T${hours}${minutes}${seconds}`;
            };

            // Create iCalendar content
            let icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//PinBoard//DE',
                'CALSCALE:GREGORIAN',
                'METHOD:PUBLISH'
            ];

            // Add events
            appointments.forEach(app => {
                icsContent = icsContent.concat([
                    'BEGIN:VEVENT',
                    `UID:${generateUID()}`,
                    `DTSTAMP:${formatDateTime(new Date().toISOString())}Z`,
                    `DTSTART:${formatDateTime(app.beginAt)}Z`,
                    `DTEND:${formatDateTime(app.endAt)}Z`,
                    `SUMMARY:${app.title?.trim() || ''}`,
                    'END:VEVENT'
                ]);
            });

            // Close calendar
            icsContent.push('END:VCALENDAR');

            // Create file content with proper line endings
            const fileContent = icsContent.join('\r\n');

            const blob = new Blob([fileContent], {
                type: 'text/calendar;charset=utf-8'
            });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'termine.ics';
            link.click();
        } catch (error) {
            console.error('Error exporting appointments:', error);
            alert('Fehler beim Exportieren der Termine.');
        }
    }
}