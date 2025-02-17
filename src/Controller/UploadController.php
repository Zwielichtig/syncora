<?php

class UploadController extends BaseController {

    static function uploadFile($path, $file_name, $file) {
        $status = [
            'success' => true,
            'message' => '',
        ];
        
        if (!move_uploaded_file($file, $file_path)) {
            $status['success'] = false;
            $status['message'] = 'Die Datei '.$file_name.' konnte nicht unter '.$path.' gespeichert werden.';
        } else {
            $status['file_path'] = $file_path;
        }
        return $status;
    }
}


?>