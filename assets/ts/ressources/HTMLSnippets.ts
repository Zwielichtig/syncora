export class HTMLSnippets {
    public static PIN : string = `
        <div class="pin">
            <div class="pin-header">
                <div class="category-icon rounded-circle">
                </div>
                <span class="pin-title">
                </span>
                <button type="button" class="btn edit-icon" title="bearbeiten">
                    <i class="fa-solid fa-pen"></i>
                </button>
            </div>
            <div class="pin-body">
            </div>
        </div>
    `

    public static NOTE_CONTENT = `
        <div class="note p-3">
            <p class="note-content mb-0"></p>
        </div>
    `

    public static TO_DO_CONTENT = `
        <div class="to-do p-3">
        </div>
    `

    public static TO_DO_ENTRY = `
        <div class="to-do-entry d-flex align-items-center mb-2">
            <div class="form-check">
                <input type="checkbox" class="form-check-input to-do-entry-checkbox">
                <span class="to-do-entry-content ms-2"></span>
            </div>
            <small class="to-do-entry-datetime text-muted ms-auto"></small>
        </div>
    `

    public static APPOINTMENT_CONTENT = `
        <div class="appointment p-3">
            <i class="far fa-calendar-alt me-2"></i>
            <span class="appointment-datetime"></span>
        </div>
    `

    public static IMAGE_NOT_FOUND = `
        <div class="image-not-found d-flex align-items-center justify-content-center p-4">
            <i class="fa-regular fa-image text-muted fs-1"></i>
        </div>
    `

    public static PIN_EDITOR = `
        <div class="modal fade pin-editor" tabindex="-1" aria-labelledby="pinEditorLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="pinEditorLabel">Pin bearbeiten</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-2 pin-titel-editor">
                            <label class="col-sm-3 col-form-label">Titel</label>
                            <div class="col-sm-9">
                                <input type="text" class="form-control pin-title-input">
                            </div>
                        </div>
                        <div class="row mb-2 pin-category-editor">
                            <label class="col-sm-3 col-form-label">Kategorie</label>
                            <div class="col-sm-9">
                                <select class="form-select pin-category-select">
                                    <!-- available Categories -->
                                </select>
                            </div>
                        </div>
                        <hr>
                        <div class="pin-content-editor">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    public static TO_DO_EDITOR = `
        <div class="to-do-editor">
            <div class="to-do-editor-entries">
            </div>
            <div class="to-do-editor-add">
                <button class="to-do-entry-add-btn">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        </div>
    `

    public static TO_DO_ENTRY_EDITOR = `
    <div class="row mb-2 to-do-entry-editor align-items-center">
        <div class="col-auto">
            <input type="checkbox" class="form-check-input to-do-entry-checkbox">
        </div>
        <div class="col">
            <input type="text" class="form-control to-do-entry-content-input" placeholder="Aufgabe">
        </div>
        <div class="col-auto">
            <input type="datetime-local" class="form-control to-do-entry-datetime-input">
        </div>
        <div class="col-auto">
            <button class="to-do-entry-delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        <hr>
    </div>
    `
    public static NOTE_CONTENT_EDITOR = `
        <div class="row mb-2 note-editor">
            <label class="col-sm-3 col-form-label">Notiz</label>
            <div class="col-sm-9">
                <textarea class="form-control note-content-input" rows="4"></textarea>
            </div>
        </div>
    `

    public static APPOINTMENT_EDITOR = `
    <div class="row mb-2 appointment-editor">
        <label class="col-sm-3 col-form-label">Termin</label>
        <div class="col-sm-9">
            <input type="datetime-local" class="form-control appointment-datetime-input">
        </div>
    </div>
    `

    public static IMAGE_EDITOR_UPLOAD = `
         <div class="row mb-2 image-editor">
            <label class="col-sm-3 col-form-label">Bild</label>
            <div class="col-sm-9">
                <input type="file" class="form-control image-input" accept="image/png, image/jpeg, image/webp">
            </div>
        </div>
    `

    public static IMAGE_EDITOR_FILE = `
         <div>
            <div class="image-thumb">
            </div>
            <button class="image-delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `


}