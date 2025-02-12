<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

class BaseController extends AbstractController
{
    public $request;

    public function __construct()
    {
        $this->request = Request::createFromGlobals();
    }
}