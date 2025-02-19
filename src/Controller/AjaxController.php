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
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;




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
                case 'update-pin':
                    $response = $this->updatePin($input);
                    break;
                case 'delete-pin':
                    $response = $this->deletePin($input);
                    break;
                case 'get-appointments-export':
                    $response = $this->getAppointmentsForExport();
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
            $response->setSuccesful();
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
                                    'title' => $pin->getTitle(),
                                    'beginAt' => $appointment->getBeginAt() ? $appointment->getBeginAt()->format('c') : null,
                                    'endAt' => $appointment->getEndAt() ? $appointment->getEndAt()->format('c') : null
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

        // Debug log
        error_log('Updating pins with data: ' . print_r($input, true));

        if (isset($input['data']) && is_array($input['data'])) {
            foreach ($input['data'] as $pinData) {
                if (!isset($pinData['id'])) {
                    continue;
                }

                $pin = $this->entityManager->getRepository(Pin::class)->find($pinData['id']);
                if (!$pin) {
                    continue;
                }

                // Update pin position and dimensions
                $pin->setPosX($pinData['posX']);
                $pin->setPosY($pinData['posY']);
                $pin->setWidth($pinData['width']);
                $pin->setHeight($pinData['height']);

                $this->entityManager->persist($pin);
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

                if (isset($data['beginAt'])) {
                    $beginAt = new \DateTime($data['beginAt']);
                    $appointment->setBeginAt($beginAt);
                }
                if (isset($data['endAt'])) {
                    $endAt = new \DateTime($data['endAt']);
                    $appointment->setEndAt($endAt);
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
        $response->setData(['id' => $pin->getId()]);
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

    /**
     * Updates an existing pin and its content
     */
    private function updatePin($input): AJAXResponse
    {
        $response = new AJAXResponse();
        $pinData = $input['data']['pin'];

        try {
            // Get and update the base pin
            $pin = $this->entityManager->getRepository(Pin::class)->find($pinData['id']);
            if (!$pin) {
                throw new \Exception('Pin not found');
            }

            $pin->setTitle($pinData['title']);
            $pin->setPosX($pinData['posX']);
            $pin->setPosY($pinData['posY']);
            $pin->setWidth($pinData['width']);
            $pin->setHeight($pinData['height']);

            // Update pin content based on type
            switch ($pin->getType()->getId()) {
                case 1: // Note
                    $note = $this->entityManager->getRepository(Note::class)->findOneBy(['pin' => $pin]);
                    if ($note) {
                        $note->setContent($pinData['pinContent']['content']);
                    }
                    break;

                case 2: // ToDo
                    $entries = $this->entityManager->getRepository(ToDoEntry::class)->findBy(['pin' => $pin]);
                    foreach ($pinData['pinContent']['entries'] as $index => $entryData) {
                        if (isset($entries[$index])) {
                            // Update existing entry
                            $entries[$index]->setContent($entryData['content']);
                            $entries[$index]->setChecked($entryData['done']);
                            if (isset($entryData['datetime'])) {
                                $entries[$index]->setDatetime(new \DateTime($entryData['datetime']));
                            }
                        } else {
                            // Create new entry if needed
                            $entry = new ToDoEntry();
                            $entry->setPin($pin);
                            $entry->setContent($entryData['content']);
                            $entry->setChecked($entryData['done']);
                            if (isset($entryData['datetime'])) {
                                $entry->setDatetime(new \DateTime($entryData['datetime']));
                            }
                            $this->entityManager->persist($entry);
                        }
                    }
                    break;

                case 3: // Appointment
                    $appointment = $this->entityManager->getRepository(Appointment::class)->findOneBy(['pin' => $pin]);
                    if ($appointment) {
                        $appointment->setTitle($pinData['pinContent']['title']);
                        $appointment->setBeginAt(new \DateTime($pinData['pinContent']['beginAt']));
                        $appointment->setEndAt(new \DateTime($pinData['pinContent']['endAt']));
                    }
                    break;

                case 4: // Image
                    $image = $this->entityManager->getRepository(Image::class)->findOneBy(['pin' => $pin]);
                    if ($image && isset($pinData['pinContent']['image'])) {
                        $imageData = $pinData['pinContent']['image'];
                        $imageData = preg_replace('/^data:image\/\w+;base64,/', '', $imageData);
                        $imageData = base64_decode($imageData);
                        $filename = $this->saveImage($imageData);
                        $image->setFilePath($filename);
                    }
                    break;
            }

            $this->entityManager->flush();
            $response->setSuccesful();

        } catch (\Exception $e) {
            error_log('Error updating pin: ' . $e->getMessage());
        }

        return $response;
    }

    /**
     * Deletes a pin and its associated content
     */
    private function deletePin($input): AJAXResponse
    {
        $response = new AJAXResponse();
        $pinId = $input['data']['id'];

        try {
            // Get the pin
            $pin = $this->entityManager->getRepository(Pin::class)->find($pinId);
            if (!$pin) {
                throw new \Exception('Pin not found');
            }

            // Delete associated content based on pin type
            switch ($pin->getType()->getId()) {
                case 1: // Note
                    $note = $this->entityManager->getRepository(Note::class)->findOneBy(['pin' => $pin]);
                    if ($note) {
                        $this->entityManager->remove($note);
                    }
                    break;

                case 2: // ToDo
                    $entries = $this->entityManager->getRepository(ToDoEntry::class)->findBy(['pin' => $pin]);
                    foreach ($entries as $entry) {
                        $this->entityManager->remove($entry);
                    }
                    break;

                case 3: // Appointment
                    $appointment = $this->entityManager->getRepository(Appointment::class)->findOneBy(['pin' => $pin]);
                    if ($appointment) {
                        $this->entityManager->remove($appointment);
                    }
                    break;

                case 4: // Image
                    $image = $this->entityManager->getRepository(Image::class)->findOneBy(['pin' => $pin]);
                    if ($image) {
                        // Delete image file if exists
                        $filePath = $this->getParameter('uploads_directory') . '/' . $image->getFilePath();
                        if (file_exists($filePath)) {
                            unlink($filePath);
                        }
                        $this->entityManager->remove($image);
                    }
                    break;
            }

            // Delete the pin itself
            $this->entityManager->remove($pin);
            $this->entityManager->flush();

            $response->setSuccesful();
        } catch (\Exception $e) {
            error_log('Error deleting pin: ' . $e->getMessage());
        }

        return $response;
    }

    private function getAppointmentsForExport(): AJAXResponse {
        $response = new AJAXResponse();
        $data = [];

        try {
            // Get all pins of type appointment (type_id = 3) for the current user
            $pins = $this->entityManager->getRepository(Pin::class)->createQueryBuilder('p')
                ->join('p.category', 'c')
                ->join('App\Entity\UserToCategory', 'utc', 'WITH', 'utc.category = c')
                ->where('p.type = :type')
                ->andWhere('utc.user = :userId')
                ->setParameter('type', 3)
                ->setParameter('userId', $_SESSION['user']['id'])
                ->getQuery()
                ->getResult();

            foreach ($pins as $pin) {
                $appointment = $this->entityManager->getRepository(Appointment::class)
                    ->findOneBy(['pin' => $pin]);

                if ($appointment) {
                    $data[] = [
                        'title' => $pin->getTitle(),
                        'beginAt' => $appointment->getBeginAt()->format('c'),
                        'endAt' => $appointment->getEndAt()->format('c')
                    ];
                }
            }

            $response->setSuccesful();
            $response->setData($data);
        } catch (\Exception $e) {
            error_log('Error exporting appointments: ' . $e->getMessage());
        }

        return $response;
    }
}

class AJAXResponse {
    private $data;
    private $success;
    private $message;

    public function __construct() {
        $this->success = false;
    }

    public function setData($data) {
        $this->data = $data;
    }

    public function setSuccesful() {
        $this->success = true;
    }

    public function setMessage($message) {
        $this->message = $message;
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

    public function setSuccess(bool $success = true) {
        $this->success = $success;
    }
}

?>