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

        if ($_SESSION['user'] != null && $_SESSION['user']['verified'] == false) {
            $partialContent = '<h1>;)</h1>
                                <h2>Email-Verifizierung</h2>
                                <p>Bitte rufen Sie Ihr Postfach auf und bestätigen Sie Ihre Email-Addresse.</p>';
        }

        return $this->render('/board.html.twig', [
            'user' => $_SESSION['user'] ?? null,
            'loginFailure' => $loginFailure,
            'registerFailure' => $registerFailure,
            'content' => $partialContent ?? null
        ]);
    }
}