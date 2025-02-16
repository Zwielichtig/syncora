<?php

namespace App\Services;

use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class MailService
{
    public function __construct(
        private readonly MailerInterface $mailer,
        private readonly Environment $twig
    ) {
    }

    public function sendEmail(string $template, string $to, string $subject, string $greeting, string $message, string $authToken): void
    {
        $emailContent = $this->twig->render('/mailTemplates/' . $template . '.html.twig', [
            'subject' => $subject,
            'greeting' => $greeting,
            'message' => $message,
            'authToken' => $authToken
        ]);

        $email = (new Email())
            ->from('syncora@authentication.com')
            ->to($to)
            ->subject($subject)
            ->html($emailContent);

        $this->mailer->send($email);
    }
}
