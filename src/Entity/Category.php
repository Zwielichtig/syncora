<?php

namespace App\Entity;

use App\Repository\CategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Color $color = null;

    /**
     * @var Collection<int, Pin>
     */
    #[ORM\OneToMany(targetEntity: Pin::class, mappedBy: 'category')]
    private Collection $pins;

    public function __construct()
    {
        $this->pins = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getColor(): ?Color
    {
        return $this->color;
    }

    public function setColor(?Color $color): static
    {
        $this->color = $color;

        return $this;
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
            $pin->setCategory($this);
        }

        return $this;
    }

    public function removePin(Pin $pin): static
    {
        if ($this->pins->removeElement($pin)) {
            // set the owning side to null (unless already changed)
            if ($pin->getCategory() === $this) {
                $pin->setCategory(null);
            }
        }

        return $this;
    }
}
