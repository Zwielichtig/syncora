<?php

namespace App\Controller;

use App\Services\SessionService;
use App\Services\ValidationService;
use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class BaseController extends AbstractController
{
    public $request;
    protected $databaseService;
    protected $validationService;
    protected $sessionService;

    public function __construct()
    {
        $this->request = Request::createFromGlobals();
        $this->validationService = new ValidationService();
        $this->sessionService = new SessionService();

        $this->sessionService->manageSession();
    }
}