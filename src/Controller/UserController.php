<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends BaseController
{
    #[Route('/login/send')]
    public function login(Request $request): Response
    {
        $fieldnames = $request->request->all();
        $user = $this->databaseService->getUser($fieldnames['username'], $fieldnames['password'])[0];

        if ($user) {
            $_SESSION['loggedIn'] = true;
            $_SESSION['user']     = [
                'id'           => $user['id'],
                'userName'     => $user['username'],
                'email'        => $user['email'],
            ];

            return $this->redirectToRoute('homepage', [
                'loggedIn'=> $_SESSION['loggedIn'],
                // 'user'=> isset($_SESSION['user']) ? $_SESSION['user'] : false,'loggedIn' => $_SESSION['loggedIn'],
            ]);
        } else {
            return $this->redirectToRoute('/login', [
                'loggedIn' => $_SESSION['loggedIn'],
                'loginFailure' => true,
            ]);
        }
    }

    #[Route('/logout', name: 'logout')]
    public function logout(): Response
    {
        $_SESSION['loggedIn'] = false;
        // unset($_SESSION['user']);
        // session_destroy();
        return $this->redirectToRoute('homepage', [
            'loggedIn' => false,
        ]);
    }
}