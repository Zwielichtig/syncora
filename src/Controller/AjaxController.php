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
use App\Repository\AppointmentRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\DependencyInjection\Attribute\Exclude;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;




class AjaxController extends BaseController
{
    protected EntityManagerInterface $entityManager;

    #[Route('/ajax', name: 'ajax', methods: ['POST'])]
    public function handleAJAX(Request $request, EntityManagerInterface $entityManager): Response
    {
        // return new Response(json_encode($_SESSION['user']));
        $response = new AJAXResponse();
        try {
            $this->entityManager = $entityManager;
            $input = json_decode($request->getContent(), true);

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
                    $response = AjaxController::updateUserPins($input);
                    break;
                case 'create-pin':
                    $response = $this->createPin(
                        $request,
                        $this->entityManager
                    );
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
            if (!$category) continue;

            $pins = $category->getPins();
            foreach ($pins as $pin) {
                if (!$pin || !$pin->getType()) continue;

                try {
                    $pinData = [
                        'id' => $pin->getId(),
                        'title' => $pin->getTitle(),
                        'category' => $category->getId(),
                        'type' => $pin->getType()->getId(),
                        'posX' => $pin->getPosX(),
                        'posY' => $pin->getPosY(),
                        'width' => $pin->getWidth(),
                        'height' => $pin->getHeight(),
                        'pinContent' => []
                    ];

                    switch ($pin->getType()->getId()) {
                        case 1: // Note
                            $note = $this->entityManager->getRepository(Note::class)->findOneBy(['pin' => $pin]);
                            if ($note) {
                                $pinData['pinContent'] = [
                                    'id' => $note->getId(),
                                    'content' => $note->getContent()
                                ];
                            }
                            break;

                        case 2: // ToDo
                            $entries = $this->entityManager->getRepository(ToDoEntry::class)->findBy(['pin' => $pin]);
                            $pinData['pinContent']['entries'] = [];
                            foreach ($entries as $entry) {
                                $pinData['pinContent']['entries'][] = [
                                    'id' => $entry->getId(),
                                    'content' => $entry->getContent(),
                                    'checked' => $entry->isChecked(),
                                    'datetime' => $entry->getDatetime() ? $entry->getDatetime()->format('c') : null
                                ];
                            }
                            break;

                        case 3: // Appointment
                            $appointment = $this->entityManager->getRepository(Appointment::class)->findOneBy(['pin' => $pin]);
                            if ($appointment) {
                                $pinData['pinContent'] = [
                                    'id' => $appointment->getId(),
                                    'title' => $appointment->getTitle(),
                                    'begin_at' => $appointment->getBeginAt() ? $appointment->getBeginAt()->format('c') : null,
                                    'end_at' => $appointment->getEndAt() ? $appointment->getEndAt()->format('c') : null
                                ];
                            }
                            break;

                        case 4: // Image
                            $image = $this->entityManager->getRepository(Image::class)->findOneBy(['pin' => $pin]);
                            if ($image) {
                                $pinData['pinContent'] = [
                                    'id' => $image->getId(),
                                    'filePath' => $image->getFilePath()
                                ];
                            }
                            break;
                    }

                    $data[] = $pinData;
                } catch (\Exception $e) {
                    error_log('Error processing pin ' . $pin->getId() . ': ' . $e->getMessage());
                    continue;
                }
            }
        }

        $response->setSuccesful();
        $response->setData($data);
        return $response;
    }

    function updateUserPins($input): AJAXResponse
    {
        $response = new AJAXResponse();
        $pins = $input['data'];  // Get pins from data key

        foreach ($pins as $pinData) {
            if (!isset($pinData['id'])) {
                continue;
            }

            $pinEntity = $this->entityManager->getRepository(Pin::class)->find($pinData['id']);
            if (!$pinEntity) {
                continue;
            }

            // Update pin position and size
            $pinEntity->setPosX($pinData['posX']);
            $pinEntity->setPosY($pinData['posY']);
            $pinEntity->setWidth($pinData['width']);
            $pinEntity->setHeight($pinData['height']);

            $this->entityManager->persist($pinEntity);
        }

        $this->entityManager->flush();
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

    public function createPin(Request $request, EntityManagerInterface $entityManager)
    {
        $response = new AJAXResponse();
        $requestData = json_decode($request->getContent(), true);
        $data = $requestData['data']['pin'];

        // Debug log
        error_log('Received pin data: ' . print_r($data, true));

        // Get common pin data
        $type = $entityManager->getRepository(PinType::class)->find($data['type']['id']);
        $category = $entityManager->getRepository(Category::class)->find($data['category']['id']);

        // Create pin based on type
        $pin = new Pin();
        $pin->setType($type);
        $pin->setCategory($category);
        $pin->setTitle($data['title'] ?? '');
        $pin->setPosX($data['posX'] ?? 0);
        $pin->setPosY($data['posY'] ?? 0);
        $pin->setWidth($data['width'] ?? 200);
        $pin->setHeight($data['height'] ?? 200);

        $this->entityManager->persist($pin);
        $this->entityManager->flush();

        // Create pin content based on type
        switch ($type->getId()) {
            case 1: // Note
                $note = new Note();
                $note->setPin($pin);
                $note->setContent($data['content'] ?? '');
                $this->entityManager->persist($note);
                break;

            case 2: // ToDo
                if (isset($data['entries']) && is_array($data['entries'])) {
                    foreach ($data['entries'] as $entry) {
                        $todoEntry = new ToDoEntry();
                        $todoEntry->setPin($pin);
                        $todoEntry->setRow($entry['row'] ?? 0);
                        $todoEntry->setContent($entry['content'] ?? '');
                        $todoEntry->setChecked($entry['done'] ?? false);
                        if (isset($entry['datetime'])) {
                            $todoEntry->setDatetime(new \DateTime($entry['datetime']));
                        }
                        $this->entityManager->persist($todoEntry);
                    }
                }
                break;

            case 3: // Appointment
                $appointment = new Appointment($pin, $_SESSION['user']['id']);
                $appointment->setTitle($data['title'] ?? '');
                if (isset($data['begin_at'])) {
                    $appointment->setBeginAt(new \DateTime($data['begin_at']));
                }
                if (isset($data['end_at'])) {
                    $appointment->setEndAt(new \DateTime($data['end_at']));
                }
                $this->entityManager->persist($appointment);
                break;

            case 4: // Image
                if (isset($data['image'])) {
                    $image = new Image();
                    $image->setPin($pin);
                    $imageData = $data['image'];
                    $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $imageData);
                    $imageData = base64_decode($imageData);
                    $filename = $this->saveImage($imageData);
                    $image->setFilePath($filename);
                    $this->entityManager->persist($image);
                }
                break;
        }

        $this->entityManager->flush();
        $response->setSuccesful();
        return $response;
    }

    private function saveImage(string $base64Data): string
    {
        // Create directory if it doesn't exist
        $uploadDir = 'public/fileadmin/user_uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Generate unique filename
        $filename = uniqid() . '.png';
        $filepath = $uploadDir . $filename;

        // Save image file
        file_put_contents($filepath, $base64Data);

        return $filename;
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