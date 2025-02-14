<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends BaseController
{
    #[Route('/register/send')]
    public function register(EntityManagerInterface $entityManager)
    {
        $fieldnames = $this->request->request->all();
        $userRepository = $entityManager->getRepository(User::class);
    }

    #[Route('/login/send')]
    public function login(EntityManagerInterface $entityManager): Response
    {
        $fieldnames = $this->request->request->all();
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->getUser()->findOneBy(['username' => $fieldnames['username'], 'password' => $fieldnames['password']]);

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