<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\ByteString;

class UserController extends BaseController
{
    #[Route('/register')]
    public function register(EntityManagerInterface $entityManager): Response
    {
        if ($this->validationService->validateForm($this->request)) {
            $userRepository   = $entityManager->getRepository(User::class);
            $existingUsername = $userRepository->findOneBy(['username' => $this->request['username']]);
            $existingEmail    = $userRepository->findOneBy(['email' => $this->request['email']]);
            $errors           = [];

            $existingUsername && $errors['username'] = 'Dieser Benutzername ist bereits vergeben';
            $existingEmail && $errors['email'] = 'Diese E-Mail-Adresse wird bereits verwendet';

            if (!empty($errors)) {
                return $this->redirectToRoute('homepage', [
                    'errors' => $errors,
                    'formData' => [
                        'username' => $this->request['username'],
                        'email' => $this->request['email']
                    ]
                ]);
            }
            $authToken = ByteString::fromRandom(32)->toString();

            $user = new User();
            $user->setUsername($this->request['username']);
            $user->setEmail($this->request['email']);
            $user->setPassword(password_hash($this->request['username'] . $this->request['password'], PASSWORD_ARGON2I));
            $user->setAuthToken($authToken);
            $user->setVerified(false);

            $entityManager->persist($user);
            $entityManager->flush();

            $this->mailService->sendEmail(
                'authEmail',
                $this->request['email'],
                'Registrierung abschließen',
                'Willkommen bei Syncora',
                'Bitte klicken Sie auf den folgenden Link, um Ihre Registrierung abzuschließen:',
                $authToken
            );

            $this->setUserSession($user);

            return $this->redirectToRoute('homepage', [
            ]);
        }

        return $this->redirectToRoute('homepage', [
            'errors' => ['form' => 'Ungültige Formulardaten']
        ]);
    }

    #[Route('/login')]
    public function login(EntityManagerInterface $entityManager): Response
    {
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->findOneBy(['username' => $this->request['username']]);

        if (password_verify($this->request['username'] . $this->request['password'], $user->getPassword())) {
            $this->setUserSession($user);

            return $this->redirectToRoute('homepage', [
            ]);
        } else {
            return $this->redirectToRoute('homepage', [
                'loginFailure' => true,
            ]);
        }
    }

    #[Route('/logout', name: 'logout')]
    public function logout(): Response
    {
        $_SESSION['loggedIn'] = false;
        unset($_SESSION['user']);
        session_destroy();

        return $this->redirectToRoute('homepage', [
        ]);
    }

    #[Route('/verify-email', name: 'verify_email')]
    public function verifyEmail(EntityManagerInterface $entityManager) {
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->findOneBy(['auth_token' => Request::createFromGlobals()->query->get('token')]);

        if ($user) {
            $user->setVerified(true);
            $user->setAuthToken(null);
            $entityManager->persist($user);
            $entityManager->flush();

            $this->setUserSession($user);

            return $this->redirectToRoute('homepage', [
            ]);
        } else {
            return $this->redirectToRoute('homepage', [
                'verificationFailure' => true,
            ]);
        }
    }

    private function setUserSession($user) {
        $_SESSION['loggedIn'] = true;
        $_SESSION['user'] = [
            'id' => $user->getId(),
            'userName' => $user->getUsername(),
            'email' => $user->getEmail(),
            'verified' => $user->isVerified()
        ];
    }
}