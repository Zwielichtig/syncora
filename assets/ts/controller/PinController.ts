import { AppointmentPin } from "../models/AppointmentPin";
import { Category } from "../models/Category";
import { ImagePin } from "../models/ImagePin";
import { NotePin } from "../models/NotePin";
import { Pin } from "../models/Pin";
import { PinType } from "../models/PinType";
import { ToDoPin } from "../models/ToDoPin";
import { AjaxController } from "./AjaxController";
import { HTMLSnippets } from "../ressources/HTMLSnippets";

export class PinController {

    /**
     * entry
     */
    public static async init() {
        await PinController.loadPinTypes()
        await PinController.loadCategories()
        await PinController.loadPins()
        await PinController.displayPins()

        // Add click handlers for new pin creation
        document.querySelector('.create-note')?.addEventListener('click', (e) => {
            e.preventDefault();
            PinController.showPinEditor(1);
        });

        document.querySelector('.create-todo')?.addEventListener('click', (e) => {
            e.preventDefault();
            PinController.showPinEditor(2);
        });

        document.querySelector('.create-appointment')?.addEventListener('click', (e) => {
            e.preventDefault();
            PinController.showPinEditor(3);
        });

        document.querySelector('.create-image')?.addEventListener('click', (e) => {
            e.preventDefault();
            PinController.showPinEditor(4);
        });
    }

    private static async loadPinTypes() {
        const pinTypes = await AjaxController.getPinTypes()
        pinTypes.forEach(pinTypeData => {
            PinType.initPinTypeInstance(pinTypeData);
        });
        console.log(PinType.instances)
    }

    private static async loadCategories() {
        const userCategories = await AjaxController.getUserCategories()
        userCategories.forEach(userCategory => {
            Category.initCategoryInstance(userCategory);
        });
        console.log(Category.instances)
    }

    private static async loadPins() {
        const pins = await AjaxController.getUserPins()
        pins.forEach(pin => {
            switch (pin['type']) {
                case 1:
                    //Note
                    NotePin.initNotePinInstance(pin)
                    break
                case 2:
                    //Image
                    ImagePin.initImagePinInstance(pin)
                    break
                case 3:
                    //ToDo
                    ToDoPin.initToDoPinInstance(pin)
                    break
                case 4:
                    //Appointment
                    AppointmentPin.initAppointmentPinInstance(pin)
                    break
            }
        });
    }

    private static async displayPins() {
        console.log(Pin.instances)
        Pin.instances.forEach(pin => {
            pin.buildPin()
        });
    }

    public static async saveAll() {
        var pins:Pin[] = []

        Pin.instances.forEach(pin => {
            if (!pin.saved) {
                pins.push(pin)
            }
        });
        if (pins) {
            AjaxController.updateUserPins(pins)
        }
    }

    public static async createPin(pinType: number, categoryId: number, title: string, data: any) {
        console.log('Creating pin:', { pinType, categoryId, title, data });

        try {
            // Get category instance
            const category = Category.instances.find(c => c.id === categoryId);
            if (!category) {
                throw new Error('Category not found');
            }

            // Get pin type instance
            const type = PinType.instances.find(t => t.id === pinType);
            if (!type) {
                throw new Error('Pin type not found');
            }

            // Create pin based on type
            let pin: Pin;
            switch (pinType) {
                case 1: // Note
                    pin = new NotePin(0, type, category, title, 0, 0, 200, 200, 0, data.content);
                    break;
                case 2: // ToDo
                    pin = new ToDoPin(0, type, category, title, 0, 0, 200, 200, 0, data.entries);
                    break;
                case 3: // Appointment
                    pin = new AppointmentPin(
                        0,
                        type,
                        category,
                        title,
                        0, 0,
                        200, 200,
                        0,
                        data.beginAt ? new Date(data.beginAt) : undefined,
                        data.endAt ? new Date(data.endAt) : undefined
                    );
                    break;
                case 4: // Image
                    pin = new ImagePin(0, type, category, title, 0, 0, 200, 200, 0, data.image);
                    break;
                default:
                    throw new Error('Invalid pin type');
            }

            // Build and display the pin
            await pin.buildPin();

            await AjaxController.createPin(pin);

            return pin;
        } catch (err) {
            console.error('Error in createPin:', err);
            throw err;
        }
    }

    private static async showPinEditor(pinType: number, existingPin?: Pin) {
        console.log('Opening pin editor:', { pinType, existingPin });

        try {
            // Remove any existing modals and backdrops with proper cleanup
            const cleanup = () => {
                console.log('Starting cleanup...');
                try {
                    const modals = document.querySelectorAll('.modal-backdrop, .pin-editor');
                    console.log('Found elements to clean:', modals.length);

                    modals.forEach((el, index) => {
                        try {
                            console.log(`Cleaning element ${index}:`, el);
                            if (el.classList.contains('pin-editor')) {
                                const newEl = el.cloneNode(true);
                                el.parentNode?.replaceChild(newEl, el);
                            }
                            el.remove();
                        } catch (err) {
                            console.error(`Error cleaning element ${index}:`, err);
                        }
                    });

                    document.body.classList.remove('modal-open');
                    document.body.style.paddingRight = '';
                    console.log('Cleanup completed');
                } catch (err) {
                    console.error('Error in cleanup:', err);
                }
            };

            cleanup();

            console.log('Creating new modal...');
            const modalWrapper = document.createElement('div');
            modalWrapper.innerHTML = HTMLSnippets.PIN_EDITOR;
            const modal = modalWrapper.firstElementChild as HTMLElement;

            if (!modal) {
                throw new Error('Failed to create modal element');
            }

            // Add a unique identifier and ensure it's not a class selector
            const modalId = `pin-editor-${Date.now()}`;
            modal.id = modalId;
            modal.classList.add('modal', 'pin-editor');

            // Prevent modal from affecting page layout
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.right = '0';
            modal.style.bottom = '0';
            modal.style.left = '0';
            modal.style.zIndex = '1050';
            modal.style.overflow = 'hidden';
            modal.style.outline = '0';

            // Add padding-right to body to prevent content shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${scrollbarWidth}px`;

            // Update modal title based on pin type and mode
            const modalTitle = modal.querySelector('.modal-title');
            if (modalTitle) {
                modalTitle.textContent = existingPin
                    ? `${existingPin.title} bearbeiten`
                    : PinController.getPinTypeTitle(pinType);
            }

            // Add content editor based on pin type
            const contentEditor = modal.querySelector('.pin-content-editor');
            if (contentEditor) {
                switch (pinType) {
                    case 1: // Note
                        contentEditor.innerHTML = HTMLSnippets.NOTE_CONTENT_EDITOR;
                        break;
                    case 2: // ToDo
                        contentEditor.innerHTML = HTMLSnippets.TO_DO_EDITOR;
                        break;
                    case 3: // Appointment
                        contentEditor.innerHTML = HTMLSnippets.APPOINTMENT_EDITOR;
                        break;
                    case 4: // Image
                        contentEditor.innerHTML = HTMLSnippets.IMAGE_EDITOR_UPLOAD;
                        break;
                }
            }

            // Add category options from AjaxController
            const categorySelect = modal.querySelector('.pin-category-select') as HTMLSelectElement;
            if (categorySelect) {
                try {
                    const categories = await AjaxController.getUserCategories();
                    categories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.id.toString();
                        option.textContent = category.name;
                        categorySelect.appendChild(option);
                    });

                    // Set selected category if editing
                    if (existingPin) {
                        const option = categorySelect.querySelector(`option[value="${existingPin.category.id}"]`);
                        if (option) {
                            (option as HTMLOptionElement).selected = true;
                        }
                    }
                } catch (err) {
                    console.error('Error loading categories:', err);
                    alert('Fehler beim Laden der Kategorien');
                }
            }

            // Then populate existing data if editing
            if (existingPin) {
                console.log('Populating existing pin data:', existingPin);

                // Set title
                const titleInput = modal.querySelector('.pin-title-input') as HTMLInputElement;
                if (titleInput) {
                    titleInput.value = existingPin.title;
                }

                // Set content based on pin type
                const contentEditor = modal.querySelector('.pin-content-editor');
                if (contentEditor) {
                    switch (pinType) {
                        case 1: // Note
                            const noteInput = contentEditor.querySelector('.note-content-input') as HTMLTextAreaElement;
                            if (noteInput) {
                                noteInput.value = (existingPin as any).content || '';
                            }
                            break;
                        case 2: // ToDo
                            // Populate todo entries
                            const todoEntries = (existingPin as any).entries;
                            if (todoEntries) {
                                const todoEditor = contentEditor.querySelector('.to-do-editor-entries');
                                todoEntries.forEach((entry: any) => {
                                    const entryHtml = HTMLSnippets.TO_DO_ENTRY_EDITOR;
                                    const entryElement = document.createElement('div');
                                    entryElement.innerHTML = entryHtml;
                                    const contentInput = entryElement.querySelector('.to-do-entry-content-input') as HTMLInputElement;
                                    const checkboxInput = entryElement.querySelector('.to-do-entry-checkbox') as HTMLInputElement;
                                    const datetimeInput = entryElement.querySelector('.to-do-entry-datetime-input') as HTMLInputElement;

                                    if (contentInput) contentInput.value = entry.content;
                                    if (checkboxInput) checkboxInput.checked = entry.done;
                                    if (datetimeInput) datetimeInput.value = entry.datetime;

                                    todoEditor?.appendChild(entryElement);
                                });
                            }
                            break;
                        case 3: // Appointment
                            const dateInput = contentEditor.querySelector('.appointment-datetime-input') as HTMLInputElement;
                            if (dateInput) {
                                dateInput.value = (existingPin as any).datetime || '';
                            }
                            break;
                        case 4: // Image
                            const imageThumb = contentEditor.querySelector('.image-thumb');
                            if (imageThumb && (existingPin as any).imagePath) {
                                imageThumb.innerHTML = `<img src="${(existingPin as any).imagePath}" alt="Uploaded image" style="max-width: 100%;">`;
                            }
                            break;
                    }
                }
            }

            // Add todo list functionality if it's a todo pin
            if (pinType === 2) { // ToDo type
                const addButton = modal.querySelector('.to-do-entry-add-btn');
                const entriesContainer = modal.querySelector('.to-do-editor-entries');

                if (addButton && entriesContainer) {
                    addButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // Create new entry
                        const entryElement = document.createElement('div');
                        entryElement.innerHTML = HTMLSnippets.TO_DO_ENTRY_EDITOR;

                        // Add delete functionality to the new entry
                        const deleteBtn = entryElement.querySelector('.to-do-entry-delete-btn');
                        deleteBtn?.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            entryElement.remove();
                        });

                        // Add the new entry to the container
                        entriesContainer.appendChild(entryElement);
                    });

                    // Add delete functionality to existing entries
                    entriesContainer.querySelectorAll('.to-do-entry-delete-btn').forEach(btn => {
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            (btn as HTMLElement).closest('.to-do-entry-editor')?.remove();
                        });
                    });
                }
            }

            // Fix z-index issues
            const modalDialog = modal.querySelector('.modal-dialog');
            if (modalDialog) {
                modalDialog.setAttribute('style', 'z-index: 1055;'); // Higher than backdrop
            }

            // Ensure proper stacking context
            modal.style.zIndex = '1050';

            // Add styles to ensure proper modal rendering
            const style = document.createElement('style');
            style.textContent = `
                .modal-backdrop {
                    z-index: 1040;
                }
                .modal.pin-editor {
                    z-index: 1050;
                }
                .modal.pin-editor .modal-dialog {
                    z-index: 1055;
                }
                .modal.pin-editor .dropdown-menu {
                    z-index: 1060;
                }
            `;
            document.head.appendChild(style);

            // Add footer with buttons
            const modalContent = modal.querySelector('.modal-content');
            const footer = document.createElement('div');
            footer.className = 'modal-footer';
            footer.innerHTML = `
                <button type="button" class="btn btn-secondary" data-action="close">Abbrechen</button>
                <button type="button" class="btn btn-primary" data-action="save">Speichern</button>
            `;
            modalContent?.appendChild(footer);

            // Add event tracking
            const eventTracker = new Set<string>();

            // Handle all close actions with proper cleanup
            const closeModal = () => {
                console.log('Closing modal...');
                try {
                    const modalToClose = document.getElementById(modalId);
                    const backdrop = document.querySelector('.modal-backdrop');
                    console.log('Elements to remove:', { modalToClose, backdrop });

                    if (modalToClose && backdrop) {
                        // Log tracked events before cleanup
                        console.log('Active event listeners:', Array.from(eventTracker));

                        modalToClose.remove();
                        backdrop.remove();
                        document.body.classList.remove('modal-open');
                        document.body.style.paddingRight = '';
                        document.removeEventListener('keydown', escapeHandler);
                        eventTracker.clear();

                        console.log('Modal closed successfully');
                    }
                } catch (err) {
                    console.error('Error closing modal:', err);
                }
            };

            // Close on escape key - with cleanup
            const escapeHandler = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    closeModal();
                }
            };

            // Add event listeners with tracking
            const addModalListeners = () => {
                console.log('Adding modal listeners...');
                try {
                    // Close button in header
                    modal.querySelector('.btn-close')?.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        closeModal();
                    });

                    // Cancel button
                    modal.querySelector('button[data-action="close"]')?.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        closeModal();
                    });

                    // Save button
                    modal.querySelector('button[data-action="save"]')?.addEventListener('click', async (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        try {
                            // Get common fields
                            const titleInput = modal.querySelector('.pin-title-input') as HTMLInputElement;
                            const categorySelect = modal.querySelector('.pin-category-select') as HTMLSelectElement;

                            const title = titleInput?.value || '';
                            const categoryId = parseInt(categorySelect?.value || '0');

                            // Get content based on pin type
                            let data: any = {};
                            const contentEditor = modal.querySelector('.pin-content-editor');

                            switch (pinType) {
                                case 1: // Note
                                    const noteInput = contentEditor?.querySelector('.note-content-input') as HTMLTextAreaElement;
                                    data.content = noteInput?.value || '';
                                    break;

                                case 2: // ToDo
                                    const entries: any[] = [];
                                    contentEditor?.querySelectorAll('.to-do-entry-editor').forEach(entry => {
                                        const contentInput = entry.querySelector('.to-do-entry-content-input') as HTMLInputElement;
                                        const checkboxInput = entry.querySelector('.to-do-entry-checkbox') as HTMLInputElement;
                                        const datetimeInput = entry.querySelector('.to-do-entry-datetime-input') as HTMLInputElement;

                                        entries.push({
                                            content: contentInput?.value || '',
                                            done: checkboxInput?.checked || false,
                                            datetime: datetimeInput?.value || null
                                        });
                                    });
                                    data.entries = entries;
                                    break;

                                case 3: // Appointment
                                    const titleInput = contentEditor?.querySelector('.appointment-title-input') as HTMLInputElement;
                                    const beginInput = contentEditor?.querySelector('.appointment-begin-input') as HTMLInputElement;
                                    const endInput = contentEditor?.querySelector('.appointment-end-input') as HTMLInputElement;

                                    data.title = titleInput?.value || '';
                                    data.beginAt = beginInput?.value || '';
                                    data.endAt = endInput?.value || '';
                                    break;

                                case 4: // Image
                                    const imageInput = contentEditor?.querySelector('.image-input') as HTMLInputElement;
                                    if (imageInput?.files?.length) {
                                        const file = imageInput.files[0];
                                        // Convert file to base64
                                        const reader = new FileReader();
                                        data.image = await new Promise((resolve) => {
                                            reader.onload = (e) => resolve(e.target?.result);
                                            reader.readAsDataURL(file);
                                        });
                                    }
                                    break;
                            }

                            // Validate required fields
                            if (!title) {
                                alert('Bitte geben Sie einen Titel ein');
                                return;
                            }
                            if (!categoryId) {
                                alert('Bitte wählen Sie eine Kategorie aus');
                                return;
                            }

                            if (existingPin) {
                                // Update existing pin
                                existingPin.title = title;
                                existingPin.category = Category.getCategoryInstance(categoryId);

                                // Update type-specific data
                                switch (pinType) {
                                    case 1: // Note
                                        (existingPin as any).content = data.content;
                                        break;
                                    case 2: // ToDo
                                        (existingPin as any).entries = data.entries;
                                        break;
                                    case 3: // Appointment
                                        (existingPin as any).datetime = data.datetime;
                                        break;
                                    case 4: // Image
                                        if (data.image) {
                                            (existingPin as any).imagePath = data.image;
                                        }
                                        break;
                                }

                                // Update pin in UI
                                existingPin.updatePin();

                                // Mark as unsaved for later sync
                                existingPin.setSaved(false);
                            } else {
                                // Create new pin
                                await PinController.createPin(pinType, categoryId, title, data);
                            }

                            closeModal();

                        } catch (err) {
                            console.error('Error saving pin:', err);
                            alert('Fehler beim Speichern des Pins');
                        }
                    });

                    // Backdrop click
                    modal.addEventListener('click', (e) => {
                        console.log('Modal click target:', e.target);
                        if (e.target === modal) {
                            e.preventDefault();
                            e.stopPropagation();
                            closeModal();
                        }
                    });

                    // Prevent clicks inside modal from closing it
                    modal.querySelector('.modal-dialog')?.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });

                    // Escape key
                    document.addEventListener('keydown', escapeHandler);

                    console.log('Modal listeners added successfully');
                } catch (err) {
                    console.error('Error adding modal listeners:', err);
                }
            };

            // Add modal to body and show it
            document.body.appendChild(modal);
            addModalListeners();

            // Add backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.style.zIndex = '1040';
            document.body.appendChild(backdrop);

            // Show modal with animation
            requestAnimationFrame(() => {
                modal.classList.add('show');
                modal.style.display = 'block';
                document.body.classList.add('modal-open');
            });

            console.log('Modal setup completed');
            return modal;
        } catch (err) {
            console.error('Fatal error in showPinEditor:', err);
            throw err;
        }
    }

    private static getPinTypeTitle(pinType: number): string {
        switch (pinType) {
            case 1:
                return 'Neue Notiz';
            case 2:
                return 'Neue To-Do Liste';
            case 3:
                return 'Neuer Termin';
            case 4:
                return 'Neues Bild';
            default:
                return 'Neuer Pin';
        }
    }

    // Add logging to the Pin class edit method
    public static editPin(pin: Pin) {
        console.log('Edit pin called for pin:', pin.id);
        try {
            // First ensure any existing modals are properly cleaned up
            const cleanup = () => {
                console.log('Cleaning up before editing pin:', pin.id);
                document.querySelectorAll('.modal-backdrop, .pin-editor').forEach(el => {
                    console.log('Removing element:', el);
                    el.remove();
                });
                document.body.classList.remove('modal-open');
                document.body.style.paddingRight = '';
            };

            cleanup();

            // Show the editor
            console.log('Showing editor for pin:', pin.id);
            PinController.showPinEditor(pin.type.id, pin);
        } catch (err) {
            console.error('Error editing pin:', pin.id, err);
        }
    }
}