export class HTMLSnippets {
    public static PIN : string = `
        <div class="pin">
            <div class="pin-header">
                <div class="category-icon">
                </div>
                <span class="pin-title">
                </span>
                <div class="fa-solid fa-pen edit-icon" title="bearbeiten" data-bs-toggle="modal">
                </div>
            </div>
            <div class="pin-body">
            </div>
        </div>
    `

    public static NOTE_CONTENT = `
        <div class="note">
            <p class="note-content"></p>
        </div>
    `

    public static TO_DO_CONTENT = `
        <div class="to-do">
        </div>
    `

    public static TO_DO_ENTRY = `
        <div class="to-do-entry">
            <input type="checkbox" class="to-do-entry-checkbox">
            <span class="to-do-entry-content"></span>
            <span class="to-do-entry-datetime">
        </div>
        `
    
    public static APPOINTMENT_CONTENT = `
    <div class="appointment">
        <span class="appointment-datetime">
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
                        <div class="pin-titel-editor">
                            <label class="form-label">Titel</label>
                            <input type="text" class="form-control pin-title-input">
                        </div>
                        <div class="pin-category-editor">
                            <label class="form-label">Kategorie</label>
                            <select class="form-select pin-category-select">
                                <!-- available Categories -->
                            </select>
                        </div>
                        <div class="pin-content-editor">
                        </div>
                    </div>
                    <div class="modal-footer">
                    <button type="button" class="btn btn-secondary save-pin-edit-btn" data-bs-dismiss="modal">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    </div>
                </div>
            </div>
        </div>
    `

    public static TO_DO_ENTRY_EDITOR = `
    <div class="to-do-entry-editor">
        <input type="checkbox" class="to-do-entry-checkbox">
        <input type="text" class="form-control to-do-entry-content-input">
        <input type="datetime-local" class="form-control to-do-entry-datetime-input">
    </div>
    `
    public static NOTE_CONTENT_EDITOR = `
        <div class="note-editor">
            <label class="form-label">Notiz</label>
            <textarea class="form-control note-content-input"></textarea>
        </div>
    `

    public static APPOINTMENT_EDITOR = `
    <div class="appointment-editor">
        <input type="datetime-local" class="form-control appointment-datetime-input">
    </div>
    `

}