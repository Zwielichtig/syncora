<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class FallbackController extends BaseController
{
    #[Route('/{any}', name: 'not_found', requirements: ['any' => '.+'], methods: ['GET'])]
    public function handleNotFound(): Response
    {
        $content = '<h1>404</h1>
                    <h2>Oops! Seite nicht gefunden</h2>
                    <p>Die von Ihnen gesuchte Seite existiert leider nicht oder wurde verschoben.</p>
                    <a href="/" class="btn btn-primary back-home">
                    <i class="fas fa-home me-2"></i>Zurück zur Startseite
                    </a>';

        return $this->render('errorPage.html.twig', [
            'content' => $content,
            'user' => $_SESSION['user']
        ]);
    }
}