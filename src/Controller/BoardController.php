<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class BoardController extends BaseController
{
    #[Route('/', name: 'homepage')]
    public function showHome(): Response
    {
        return $this->render('/board.html.twig', [
            'loggedIn' => $_SESSION['loggedIn']
        ]);
    }
}