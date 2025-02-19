<?php

namespace App\Entity;

use App\Repository\ToDoEntryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ToDoEntryRepository::class)]
class ToDoEntry
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Pin $pin = null;

    #[ORM\Column]
    private ?int $row = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $content = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $datetime = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $checked = false;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPin(): ?Pin
    {
        return $this->pin;
    }

    public function setPin(?Pin $pin): static
    {
        $this->pin = $pin;

        return $this;
    }

    public function getRow(): ?int
    {
        return $this->row;
    }

    public function setRow(int $row): static
    {
        $this->row = $row;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getDatetime(): ?\DateTimeInterface
    {
        return $this->datetime;
    }

    public function setDatetime(?\DateTimeInterface $datetime): static
    {
        $this->datetime = $datetime;

        return $this;
    }

    public function isChecked(): bool
    {
        return $this->checked;
    }

    public function setChecked(bool $checked): static
    {
        $this->checked = $checked;

        return $this;
    }
}
