<?php

namespace App\Controller;

use App\Entity\Appointment;
use App\Entity\Category;
use App\Entity\PinType;
use App\Entity\Pin;
use App\Entity\Note;
use App\Entity\Image;
use App\Entity\ToDoEntry;
use App\Entity\User;
use App\Entity\UserToCategory;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\DependencyInjection\Attribute\Exclude;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;




class AjaxController extends BaseController
{
    protected EntityManagerInterface $entityManager;

    #[Route('/ajax', name: 'ajax', methods: ['POST'])]
    public function handleAJAX(EntityManagerInterface $entityManager): Response
    {
        // return new Response(json_encode($_SESSION['user']));
        $response = new AJAXResponse();
        try {
            $this->entityManager = $entityManager;
            $input = json_decode(file_get_contents('php://input'), true);

            $function = $input['function'];



            switch ($function) {
                case 'upload-file':
                    $response = AjaxController::uploadFile(
                        fileData: $input['data']['fileData'],
                        filePath: $input['data']['filePath']
                    );
                    break;
                case 'create-category':
                    $response = AjaxController::createCategory(
                        name: $input['data']['name'],
                        color: $input['data']['color']

                    );
                    break;
                case 'get-pin-types':
                    $response = AjaxController::getPinTypes();
                    break;
                case 'get-current-user':
                    $response = AjaxController::getCurrentUser();
                    break;
                case 'get-user-categories':
                    $response = AjaxController::getUserCategories();
                    break;
                case 'delete-categories':
                    $response = AjaxController::deleteCategory($input['data']['categoryId']);
                    break;
                case 'get-calendar-datetimes':
                    $response = AjaxController::getCalendarDatetimes();
                    break;
                case 'get-user-pins':
                    $response = AjaxController::getUserPins();
                    break;
                case 'update-user-pins':
                    $response = AjaxController::updateUserPins($input['data']);
                    break;


            }
            // $response = AjaxController::getUserCategories();
        } catch (Exception $e) {
            return new Response($e, 500);
        }

        return new Response($response->getData(), $response->getResponseCode());

    }

    function uploadFile(string $fileData, string $filePath): AJAXResponse
    {
        $response = new AJAXResponse();
        if (!move_uploaded_file($fileData, $filePath)) {
            $message = 'Die Datei konnte nicht unter '.$filePath.' gespeichert werden.';
            $response->setMessage($message);
        } else {
            $response->setSuccess(true);
        }
        return $response;
    }

    function createCategory(string $name, string $color) :AJAXResponse {
        $response = new AJAXResponse();

        if ($_SESSION['user']) {
            $newCategory = new Category();
            $newCategory->setName($name);
            $newCategory->setColor($color);
            $this->entityManager->persist($newCategory);
            $this->entityManager->flush();

            $userToCategory = new UserToCategory();
            $userToCategory->setUser($this->entityManager->getRepository(User::class)->findOneBy(['id' => $_SESSION['user']['id']]));
            $userToCategory->setCategory($this->entityManager->getRepository(Category::class)->findOneBy(['id' => $newCategory->getId()]));
            $this->entityManager->persist($userToCategory);

            $this->entityManager->flush();

            $response->setSuccesful();

            $response->setData([
                'id' => $newCategory->getId()
            ]);
        }
        return $response;
    }

    function deleteCategory(int $categoryId) :AJAXResponse {
        $response = new AJAXResponse();

        if ($_SESSION['user']) {
            $categoryToUser = $this->entityManager->getRepository(UserToCategory::class)->findOneBy([
                'user' => $_SESSION['user']['id'],
                'category' => $categoryId
            ]);
            $this->entityManager->remove($categoryToUser);
            $this->entityManager->flush();

            $category = $this->entityManager->getRepository(Category::class)->findOneBy(['id' => $categoryId]);
            $this->entityManager->remove($category);

            $this->entityManager->flush();

            $response->setSuccesful();
            $response->setData(true);
        } else {
            $response->setSuccesful();
            $response->setData(false);
        }
        return $response;
    }


    function getPinTypes(): AJAXResponse
    {
        $response = new AJAXResponse();
        $pinTypes = $this->entityManager->getRepository(PinType::class)->findAll();
        $data = [];
        foreach ($pinTypes as $pinType) {
            $data[] = [
                'id' => $pinType->getId(),
                'name' => $pinType->getName()
            ];
        }
        $response->setSuccesful();
        $response->setData($data);
        return $response;
    }

    function getCurrentUser() : AJAXResponse
    {
        $response = new AJAXResponse();

        $data = [
            'id' => $_SESSION['user']['id'],
            'name' => $_SESSION['user']['userName'],
            'email' => $_SESSION['user']['email']
        ];
        $response->setSuccesful();
        $response->setData($data);
        return $response;
    }

    function getUserCategories() : AJAXResponse
    {
        $response = new AJAXResponse();
        $userToCategories = $this->entityManager->getRepository(UserToCategory::class)->findBy(['user'=> $_SESSION['user']['id']]);
        $data = [];

        foreach ($userToCategories as $userToCategory) {
            $category = $userToCategory->getCategory();
            $data[] = [
                'id' => $category->getId(),
                'name' => $category->getName(),
                'color' => $category->getColor()
            ];
        }

        $response->setSuccesful();
        $response->setData($data);
        return $response;
    }

    function getUserPins(): AJAXResponse
    {
        $response = new AJAXResponse();
        $userToCategories = $this->entityManager->getRepository(UserToCategory::class)->findBy([
            'user'=> $_SESSION['user']['id']
        ]);


        $data = [];
        foreach ($userToCategories as $userToCategory) {
            $category = $userToCategory->getCategory();

            $pins = $category->getPins();
            foreach ($pins as $pin) {
                $pinData = [
                    'id' => $pin->getId(),
                    'title' => $pin->getTitle(),
                    'category' =>$pin->getCategory()->getId(),
                    'type' => $pin->getType()->getId(),
                    'posX' => $pin->getPosX(),
                    'posY' => $pin->getPosY(),
                    'width' => $pin->getWidth(),
                    'height' => $pin->getHeight()
                ];

                $pinContent = [];
                switch ($pin->getType()->getId()) {

                    case 1:
                        //Notiz
                        $note = $this->entityManager->getRepository(Note::class)->findOneBy([
                            'pin'=> $pin->getId()
                        ]);

                        $pinContent['id'] = $note->getId();
                        $pinContent['content'] = $note->getContent();
                        break;

                    case 2:
                        //Image
                        $image = $this->entityManager->getRepository(Image::class)->findOneBy([
                            'pin'=> $pin->getId()
                        ]);
                        $pinContent['id'] = $image->getId();
                        $pinContent['filePath'] = $image->getFilePath();
                        break;
                    case 3:
                        //ToDo
                        $toDoEntries = $this->entityManager->getRepository(ToDoEntry::class)->findBy([
                            'pin'=> $pin->getId()
                        ]);

                        $entries = [];
                        foreach ($toDoEntries as $entry) {
                            $entries[] = [
                                'id' => $entry->getId(),
                                'row' => $entry->getRow(),
                                'datetime' => $entry->getDatetime(),
                                'content' => $entry->getContent(),
                            ];
                        }


                        $pinContent['entries'] = $entries;
                        break;
                    case 4:
                        //Appointment
                        $appointment = $this->entityManager->getRepository(Appointment::class)->findOneBy([
                            'pin'=> $pin->getId()
                        ]);

                        $pinContent['id'] = $appointment->getId();
                        $pinContent['datetime'] = $appointment->getDatetime();
                        break;

                }
                $pinData['pinContent'] = $pinContent;
                $data[] = $pinData;
            }

        }
        $response->setData($data);
        $response->setSuccesful();
        return $response;
    }

    function updateUserPins($input)
    {
        $response = new AJAXResponse();

        foreach ($input as $pinData) {

            if($pinData['id'] != null) {
                $pin = $this->entityManager->getRepository(Pin::class)->find($pinData['id']);
            } else {
                $pin = new Pin();
            }
            $category = $this->entityManager->getRepository(Category::class)->find($pinData['category']);
            $pin->setCategory($category);
            $pin->setTitle($pinData['title']);
            $pin->setPosX($pinData['posX']);
            $pin->setPosY($pinData['posY']);
            $pin->setWidth($pinData['width']);
            $pin->setHeight($pinData['height']);

            $pinContent = $pinData['pinContent'];
            switch ($pinData['type']) {
                case 1:
                    //Notiz
                    if($pinContent['id'] != null) {
                        $note = $this->entityManager->getRepository(Note::class)->find($pinContent['id']);
                    } else {
                        $note = new Note();
                    }
                    $note->setContent($pinContent['content']);
                    if($pinContent['id'] == null) {
                        $this->entityManager->persist($note);
                    }

                    break;
                case 2:
                    //Image
                    if($pinContent['id'] != null) {
                        $image = $this->entityManager->getRepository(Image::class)->find($pinContent['id']);
                    } else {
                        $image = new Image();
                    }
                    $image->setFilePath($pinContent['filePath']);
                    if($pinContent['id'] == null) {
                        $this->entityManager->persist($image);
                    }

                    break;
                case 3:
                    //ToDo
                    foreach($pinContent['entries'] as $entryContent) {
                        if($entryContent['id'] != null) {
                            $entry = $this->entityManager->getRepository(ToDoEntry::class)->find($entryContent['id']);
                        } else {
                            $entry = new ToDoEntry();
                        }
                        $entry->setRow($entryContent['row']);
                        $entry->setContent($entryContent['content']);
                        $datetime = \DateTime::createFromFormat('Y-m-d\TH:i:s.uP', $entryContent['datetime']);
                        $entry->setDatetime($datetime);
                        $entry->setChecked($entryContent['checked']);
                        if($entryContent['id'] == null) {
                            $this->entityManager->persist($entry);
                        }
                    }

                    break;
                case 4:
                    //Appointment
                    if($pinContent['id'] != null) {
                        $appointment = $this->entityManager->getRepository(Appointment::class)->find($pinContent['id']);
                    } else {
                        $appointment = new Appointment();
                    }
                    $datetime = \DateTime::createFromFormat('Y-m-d\TH:i:s.uP', $pinContent['datetime']);
                    $appointment->setDatetime($datetime);
                    if($pinContent['id'] == null) {
                        $this->entityManager->persist($appointment);
                    }
                    break;

            }
            $this->entityManager->flush();
        }
        $response->setSuccesful();

        return $response;

    }


    function getCalendarDatetimes() {
        $response = new AJAXResponse();
        $userToCategories = $this->entityManager->getRepository(UserToCategory::class)->findBy([
            'user'=> $_SESSION['user']['id']
        ]);


        $data = [];
        foreach ($userToCategories as $userToCategory) {

            $category = $userToCategory->getCategory();

            $pins = $category->getPins();
            foreach ($pins as $pin) {
                if ($pin->getType()->getId() == 3) {
                    //To-Do
                    $entries = $this->entityManager->getRepository(ToDoEntry::class)->findBy([
                        'pin'=> $pin->getId()
                    ]);

                    foreach($entries as $entry) {
                        if ($entry->getDatetime()) {
                            $data[] = [
                                'title'=> $pin->getTitle(),
                                'datetime' => $entry->getDatetime()
                            ];
                        }
                    }


                } else if ($pin->getType()->getId() == 4) {
                    $appointment = $this->entityManager->getRepository(Appointment::class)->findOneBy([
                        'pin'=> $pin->getId()
                    ]);

                    $data[] = [
                        'title'=> $pin->getTitle(),
                        'datetime' => $appointment->getDatetime()
                    ];


                }
            }

        }
        $response->setData($data);
        $response->setSuccesful();
        return $response;
    }

}

class AJAXResponse {
    private $data;
    private $success;

    public function __construct() {
        $this->success = false;
    }

    public function setData($data) {
        $this->data = $data;
    }

    public function setSuccesful() {
        $this->success = true;
    }

    public function getResponseCode():int {
        if ($this->success) {
            return 200;
        }
        return 400;
    }

    public function getData():string {
        return json_encode($this->data);
    }
}

?>