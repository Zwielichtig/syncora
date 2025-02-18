<?php

namespace App\Controller;

use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;

$input = json_decode(file_get_contents('php://input'), true);

$function = $input['function'];

switch ($function) {
    case 'upload-file':
        echo (AjaxController::uploadFile(
            fileData: $input['data']['fileData'],
            filePath: $input['data']['filePath']
        ));

}


class AjaxController {

    static function uploadFile(string $fileData, string $filePath) {
        $response = new Response();
        if (!move_uploaded_file($fileData, $filePath)) {
            $message = 'Die Datei konnte nicht unter '.$filePath.' gespeichert werden.';
            $response->setMessage($message);
        } else {
            $response->setSuccess(true);
        }
        return $response;
    }

    static function getCategories(EntityManagerInterface $entityManager) {
        $response = new Response();
        $categories = $entityManager->getRepository(Category::class)->findAll();
        $data = [];
        foreach ($categories as $category) {
            $data[] = [
                'id' => $category->getId(),
                'name' => $category->getName()
            ];
        }


    }
}


class Response {
    private bool $success;
    private string $message;
    private Array $data;

    public function __construct() {
        $this->success = false;
    }

    public function setSuccess(bool $success) {
        $this->success = $success;
    }

    public function setMessage(string $message) {
        $this->message = $message;
    }

    public function setData(Array $data) {
        $this->data = $data;
    }

    public function toJSON() {
        return json_encode([
            'success' => $this->success,
            'message' => $this->message,
            'data' => $this->data
        ]);
    }
}

?>