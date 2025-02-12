<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CalenderController extends BaseController
{
    #[Route('/', name: 'calender')]
    public function showCalender(): Response
    {
        return $this->render('/syncora/calendar');
    }
}