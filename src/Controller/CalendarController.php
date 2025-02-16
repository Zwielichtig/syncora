<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CalendarController extends BaseController
{
    #[Route('/calendar', name: 'calendar')]
    public function showCalender(): Response
    {
        if ($_SESSION['loggedIn'] == false) {
            return $this->redirectToRoute('homepage');
        }

        return $this->render('/calendar.html.twig', [
            'loggedIn' => $_SESSION['loggedIn']
        ]);
    }
}