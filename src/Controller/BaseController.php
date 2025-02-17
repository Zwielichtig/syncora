<?php

namespace App\Controller;

use App\Services\MailService;
use App\Services\SessionService;
use App\Services\ValidationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Twig\Environment;

class BaseController extends AbstractController
{
    protected $request;
    protected $validationService;
    protected $sessionService;
    protected $mailService;

    public function __construct(MailerInterface $mailer, Environment $twig)
    {
        $request = Request::createFromGlobals();
        $this->request = $request->request->all();
        $this->validationService = new ValidationService();
        $this->sessionService = new SessionService();
        $this->mailService = new MailService($mailer, $twig);

        $this->sessionService->manageSession();
    }
}