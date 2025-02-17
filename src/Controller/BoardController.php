<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class BoardController extends BaseController
{
    #[Route('/', name: 'homepage')]
    public function showHome(): Response
    {
        $loginFailure = $_SESSION['loginFailure'] ?? false;
        $registerFailure = $_SESSION['registerFailure'] ?? false;
        unset($_SESSION['loginFailure']);
        unset($_SESSION['registerFailure']);

        return $this->render('/board.html.twig', [
            'loggedIn' => $_SESSION['loggedIn'],
            'loginFailure' => $loginFailure,
            'registerFailure' => $registerFailure,
        ]);
    }
}