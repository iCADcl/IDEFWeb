from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime
import uuid


class HeroContent(BaseModel):
    """Hero section content"""
    title: str
    subtitle: str
    image: str
    cta_primary: str = "Conocer Servicios"
    cta_secondary: str = "Contactar"


class ServiceItem(BaseModel):
    """Service item"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: str  # lucide-react icon name
    image: str
    order: int = 0


class TrainingProgram(BaseModel):
    """Training program"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    target: str
    duration: str
    description: str
    order: int = 0


class TechnologyItem(BaseModel):
    """Technology item"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    icon: str  # lucide-react icon name
    order: int = 0


class Testimonial(BaseModel):
    """Testimonial"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    content: str
    rating: int = 5
    order: int = 0


class StatItem(BaseModel):
    """Stat item"""
    label: str
    value: str
    order: int = 0


class LandingContent(BaseModel):
    """Complete landing page content"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hero: HeroContent
    stats: List[StatItem] = []
    services: List[ServiceItem] = []
    training_title: str = "Formación Profesional"
    training_subtitle: str = "Creemos en el poder del conocimiento"
    training_image: str = ""
    training_programs: List[TrainingProgram] = []
    innovation_title: str = "Innovación y Tecnología"
    innovation_subtitle: str = "La innovación es nuestro motor"
    innovation_images: List[str] = []
    technologies: List[TechnologyItem] = []
    testimonials_title: str = "Lo que dicen nuestros clientes"
    testimonials_subtitle: str = "La confianza de quienes buscan la verdad"
    testimonials: List[Testimonial] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class LandingContentUpdate(BaseModel):
    """Schema for updating landing content"""
    hero: Optional[HeroContent] = None
    stats: Optional[List[StatItem]] = None
    services: Optional[List[ServiceItem]] = None
    training_title: Optional[str] = None
    training_subtitle: Optional[str] = None
    training_image: Optional[str] = None
    training_programs: Optional[List[TrainingProgram]] = None
    innovation_title: Optional[str] = None
    innovation_subtitle: Optional[str] = None
    innovation_images: Optional[List[str]] = None
    technologies: Optional[List[TechnologyItem]] = None
    testimonials_title: Optional[str] = None
    testimonials_subtitle: Optional[str] = None
    testimonials: Optional[List[Testimonial]] = None
