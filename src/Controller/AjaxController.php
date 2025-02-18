<?php

namespace App\Controller;

use App\Entity\Appointment;
use App\Entity\Category;
use App\Entity\PinType;
use App\Entity\Pin;
use App\Entity\Note;
use App\Entity\Image;
use App\Entity\ToDoEntry;
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
                case 'get-user-categories':
                    $response = AjaxController::getUserCategories();
                    break;   
                case 'get-calendar-datetimes':
                    $response = AjaxController::getCalendarDatetimes();
                    break;
                case 'get-user-pins':
                    $response = AjaxController::getUserPins();

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
        $newCategory = new Category();
        $newCategory->setName($name);
        $newCategory->setColor($color);
        $this->entityManager->persist($newCategory);
        $this->entityManager->flush();

        $response->setSuccesful();
        $response->setData([
            'id' => $newCategory->getId()
        ]);
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

    function getUserCategories() : AJAXResponse
    {
        $response = new AJAXResponse();
        $userToCategories = $this->entityManager->getRepository(UserToCategory::class)->findBy([
            'user'=> $_SESSION['user']['id']
        ]);


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

                
                switch ($pin->getType()->getId()) {
                    
                    case 1:
                        //Notiz
                        $note = $this->entityManager->getRepository(Note::class)->findOneBy([
                            'pin'=> $pin->getId()
                        ]);
                        
                        $pinData['content'] = $note->getContent();
                        break;

                    case 2:
                        //Image
                        $image = $this->entityManager->getRepository(Image::class)->findOneBy([
                            'pin'=> $pin->getId()
                        ]);
                        
                        $pinData['filePath'] = $image->getFilePath();
                        break;
                    case 3:
                        //ToDo
                        $toDoEntries = $this->entityManager->getRepository(ToDoEntry::class)->findBy([
                            'pin'=> $pin->getId()
                        ]);

                        $entries = [];
                        foreach ($toDoEntries as $entry) {
                            $entries[] = [
                                'row' => $entry->getRow(),
                                'datetime' => $entry->getDatetime(),
                                'content' => $entry->getContent(),
                            ];
                        }

                        
                        $pinData['entries'] = $entries;
                        break;
                    case 4:
                        //Appointment
                        $appointment = $this->entityManager->getRepository(Appointment::class)->findOneBy([
                            'pin'=> $pin->getId()
                        ]);
                        
                        $pinData['datetime'] = $appointment->getDatetime();
                        break;
                    
                }
                $data[] = $pinData;
            }
            
        }
        $response->setData($data);
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