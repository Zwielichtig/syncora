<?php

namespace App\Entity;

use App\Repository\ColorRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ColorRepository::class)]
class Color
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 9)]
    private ?string $hexcode = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHexcode(): ?string
    {
        return $this->hexcode;
    }

    public function setHexcode(string $hexcode): static
    {
        $this->hexcode = $hexcode;

        return $this;
    }
}
