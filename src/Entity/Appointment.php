<?php

namespace App\Entity;

use App\Repository\AppointmentRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use CalendarBundle\Entity\Event;

#[ORM\Entity(repositoryClass: AppointmentRepository::class)]
class Appointment extends Event
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    protected int $id;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    protected Pin $pin;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    protected \DateTimeInterface $beginAt;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    protected ?\DateTimeInterface $endAt = null;

    #[ORM\Column(length: 255)]
    protected string $title = '';

    #[ORM\Column(name: 'user_id')]
    protected int $userId;

    public function __construct(Pin $pin, int $userId)
    {
        $this->pin = $pin;
        $this->userId = $userId;
        $this->beginAt = new \DateTime();
        $this->endAt = new \DateTime('+1 hour');
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getPin(): Pin
    {
        return $this->pin;
    }

    public function setPin(Pin $pin): void
    {
        $this->pin = $pin;
        $this->title = $pin->getTitle();
    }

    public function getBeginAt(): \DateTimeInterface
    {
        return $this->beginAt;
    }

    public function setBeginAt(\DateTimeInterface $beginAt): void
    {
        $this->beginAt = $beginAt;
    }

    public function getEndAt(): ?\DateTimeInterface
    {
        return $this->endAt;
    }

    public function setEndAt(?\DateTimeInterface $endAt): void
    {
        $this->endAt = $endAt;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    public function getUser(): int
    {
        return $this->userId;
    }

    public function setUser(int $userId): void
    {
        $this->userId = $userId;
    }
}
