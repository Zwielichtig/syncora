<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CalendarController extends BaseController
{
    #[Route('/calendar', name: 'calendar')]
    public function showCalender(): Response
    {
        if ($_SESSION['user'] == null) {
            return $this->redirectToRoute('homepage');
        }

        return $this->render('/calendar.html.twig', [
            'user' => $_SESSION['user']
        ]);
    }
}