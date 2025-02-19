<?php

namespace App\Controller;

use App\Repository\AppointmentRepository;
use Symfony\Component\HttpFoundation\Request;
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

    #[Route('/fc-load-events', name: 'fc_load_events', methods: ['POST'])]
    public function loadEvents(Request $request, AppointmentRepository $appointmentRepository): Response
    {
        $start = new \DateTime($request->get('start'));
        $end = new \DateTime($request->get('end'));

        $appointments = $appointmentRepository->findBetweenDates($start, $end, $_SESSION['user']['id']);

        $events = [];
        foreach ($appointments as $appointment) {
            $events[] = [
                'id' => $appointment->getId(),
                'title' => $appointment->getTitle(),
                'start' => $appointment->getBeginAt()->format('Y-m-d H:i:s'),
                'end' => $appointment->getEndAt() ? $appointment->getEndAt()->format('Y-m-d H:i:s') : null,
                'backgroundColor' => $appointment->getPin()->getCategory()->getColor(),
                'borderColor' => $appointment->getPin()->getCategory()->getColor(),
            ];
        }

        return $this->json($events);
    }
}