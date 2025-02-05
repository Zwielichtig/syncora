<?php

namespace App\Entity;

use App\Repository\PinTypeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PinTypeRepository::class)]
class PinType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * @var Collection<int, Pin>
     */
    #[ORM\OneToMany(targetEntity: Pin::class, mappedBy: 'type')]
    private Collection $pins;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    public function __construct()
    {
        $this->pins = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Pin>
     */
    public function getPins(): Collection
    {
        return $this->pins;
    }

    public function addPin(Pin $pin): static
    {
        if (!$this->pins->contains($pin)) {
            $this->pins->add($pin);
            $pin->setType($this);
        }

        return $this;
    }

    public function removePin(Pin $pin): static
    {
        if ($this->pins->removeElement($pin)) {
            // set the owning side to null (unless already changed)
            if ($pin->getType() === $this) {
                $pin->setType(null);
            }
        }

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }
}
