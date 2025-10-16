// Mock data for IDEF Internacional landing page

export const heroData = {
  title: "Ciencia y Tecnología para la Justicia",
  subtitle: "En la búsqueda de la verdad, cada detalle cuenta. Transformamos la evidencia en respuestas.",
  image: "https://images.pexels.com/photos/10481253/pexels-photo-10481253.jpeg"
};

export const servicesData = [
  {
    id: 1,
    title: "Análisis Forense",
    description: "Análisis riguroso de evidencias utilizando tecnología de vanguardia. Desde huellas dactilares hasta análisis de microevidencias.",
    icon: "Microscope",
    image: "https://images.unsplash.com/photo-1758685734180-7a2f63f0e41d"
  },
  {
    id: 2,
    title: "Peritaje Especializado",
    description: "Informes periciales objetivos y fundamentados científicamente. Aportamos claridad en los casos más complejos.",
    icon: "FileText",
    image: "https://images.unsplash.com/photo-1758685848662-0aad938fd19a"
  },
  {
    id: 3,
    title: "Reconstrucción Virtual",
    description: "Reconstrucción tridimensional de eventos mediante tecnología avanzada. Ver lo que antes era invisible.",
    icon: "Layers",
    image: "https://images.unsplash.com/photo-1760074032600-36943c264fbf"
  }
];

export const trainingData = {
  title: "Formación Profesional",
  subtitle: "Creemos en el poder del conocimiento. Formamos a los profesionales que enfrentan los desafíos del presente y del futuro.",
  programs: [
    {
      id: 1,
      name: "Curso de Criminalística Avanzada",
      target: "Peritos y técnicos forenses",
      duration: "120 horas",
      description: "Metodologías modernas de análisis de evidencias y procedimientos de investigación criminal."
    },
    {
      id: 2,
      name: "Peritaje para Fiscales y Defensores",
      target: "Abogados y operadores de justicia",
      duration: "80 horas",
      description: "Interpretación de informes periciales y comprensión de métodos científicos aplicados a la justicia."
    },
    {
      id: 3,
      name: "Tecnología Forense Digital",
      target: "Investigadores y peritos digitales",
      duration: "100 horas",
      description: "Análisis de dispositivos electrónicos, recuperación de datos y cadena de custodia digital."
    }
  ],
  image: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4"
};

export const innovationData = {
  title: "Innovación y Tecnología",
  subtitle: "La innovación es nuestro motor. Desarrollamos herramientas y metodologías que rompen barreras.",
  technologies: [
    {
      id: 1,
      name: "Análisis de ADN",
      description: "Secuenciación genética de última generación para identificación precisa.",
      icon: "Dna"
    },
    {
      id: 2,
      name: "Reconstrucción 3D",
      description: "Modelado tridimensional de escenas y eventos para análisis espacial.",
      icon: "Cube"
    },
    {
      id: 3,
      name: "Análisis Digital",
      description: "Forense computacional y recuperación de evidencia digital.",
      icon: "HardDrive"
    },
    {
      id: 4,
      name: "Microscopía Avanzada",
      description: "Análisis de microevidencias con equipamiento de alta precisión.",
      icon: "Scan"
    }
  ],
  images: [
    "https://images.unsplash.com/photo-1606206886378-e49a19ad0933",
    "https://images.unsplash.com/photo-1657778752125-e981b86920a3"
  ]
};

export const statsData = [
  { label: "Años de Experiencia", value: "15+" },
  { label: "Casos Analizados", value: "5000+" },
  { label: "Profesionales Formados", value: "3000+" },
  { label: "Países de Operación", value: "12" }
];

export const testimonialsData = [
  {
    id: 1,
    name: "Dr. Carlos Mendoza",
    role: "Fiscal General",
    content: "La precisión y calidad de los informes de IDEF han sido fundamentales para resolver casos complejos. Su compromiso con la verdad es ejemplar.",
    rating: 5
  },
  {
    id: 2,
    name: "Lic. María Torres",
    role: "Defensora Pública",
    content: "Los cursos de formación han transformado mi comprensión del peritaje. Ahora puedo defender con mayor fundamento técnico.",
    rating: 5
  },
  {
    id: 3,
    name: "Perito Andrés Ruiz",
    role: "Criminalista",
    content: "La tecnología y metodologías que aplica IDEF están a la vanguardia internacional. Un referente en América Latina.",
    rating: 5
  }
];

// Mock function to simulate contact form submission
export const submitContactForm = async (formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Mock form submission:', formData);
      resolve({ success: true, message: 'Formulario enviado correctamente' });
    }, 1000);
  });
};