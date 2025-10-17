"""
Script to seed the database with IDEF diplomados
Run this once to populate the products collection
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]
products_collection = db.products

# IDEF Diplomados 2025
DIPLOMADOS = [
    {
        "name": "Diplomado Abuso Sexual 2025",
        "slug": "diplomado-abuso-sexual-2025",
        "description": "Adquiere conocimientos especializados en la pericia de abuso sexual. Aprende técnicas forenses, entrevista a víctimas, evaluación psicológica y elaboración de informes periciales. Programa completo con certificación internacional.",
        "price": 540.00,
        "currency": "USD",
        "category": "Diplomado",
        "image_url": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800",
        "features": [
            "100% Online",
            "Certificado Internacional",
            "Acceso de por vida",
            "Material descargable",
            "Docentes expertos"
        ],
        "duration": "120 horas académicas",
        "modules": 8,
        "certificate": True,
        "is_active": True
    },
    {
        "name": "Diplomado Autopsia Psicológica 2025",
        "slug": "diplomado-autopsia-psicologica-2025",
        "description": "Especialízate en autopsia psicológica reconstructiva. Metodología científica para investigar muertes dudosas, suicidios y homicidios. Técnicas de entrevista, análisis documental y elaboración de informes forenses.",
        "price": 540.00,
        "currency": "USD",
        "category": "Diplomado",
        "image_url": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
        "features": [
            "100% Online",
            "Certificado Internacional",
            "Casos prácticos reales",
            "Material actualizado 2025",
            "Metodología reconstructiva"
        ],
        "duration": "120 horas académicas",
        "modules": 10,
        "certificate": True,
        "is_active": True
    },
    {
        "name": "Diplomado Ciencia Política y Teoría del Estado 2025",
        "slug": "diplomado-ciencia-politica-2025",
        "description": "Comprende la teoría del Estado, sistemas políticos, psicopolítica y análisis del poder. Formación integral en ciencia política aplicada al contexto forense y criminológico contemporáneo.",
        "price": 540.00,
        "currency": "USD",
        "category": "Diplomado",
        "image_url": "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800",
        "features": [
            "100% Online",
            "Certificado Internacional",
            "Enfoque criminológico",
            "Análisis político contemporáneo",
            "Psicopolítica aplicada"
        ],
        "duration": "120 horas académicas",
        "modules": 9,
        "certificate": True,
        "is_active": True
    },
    {
        "name": "Diplomado Criminal Profiling 2025",
        "slug": "diplomado-criminal-profiling-2025",
        "description": "Domina el perfilamiento criminal con metodologías FBI y técnicas modernas. Análisis de escena del crimen, victimología, MO y firma del agresor. Casos prácticos internacionales.",
        "price": 540.00,
        "currency": "USD",
        "category": "Diplomado",
        "image_url": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        "features": [
            "100% Online",
            "Certificado Internacional",
            "Metodología FBI",
            "Casos internacionales",
            "Perfilamiento práctico"
        ],
        "duration": "120 horas académicas",
        "modules": 12,
        "certificate": True,
        "is_active": True
    },
    {
        "name": "Diplomado en Suicidiología 2025",
        "slug": "diplomado-suicidiologia-2025",
        "description": "Formación especializada en prevención, intervención e investigación del suicidio. Factores de riesgo, evaluación psicológica, protocolos de actuación y autopsia psicológica en casos de suicidio.",
        "price": 540.00,
        "currency": "USD",
        "category": "Diplomado",
        "image_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
        "features": [
            "100% Online",
            "Certificado Internacional",
            "Prevención del suicidio",
            "Protocolos de intervención",
            "Casos clínicos"
        ],
        "duration": "120 horas académicas",
        "modules": 8,
        "certificate": True,
        "is_active": True
    },
    {
        "name": "Diplomado Investigación de Desaparecidos 2025",
        "slug": "diplomado-investigacion-desaparecidos-2025",
        "description": "Técnicas especializadas en investigación y búsqueda de personas extraviadas y desaparecidas. Protocolos de actuación inmediata, análisis de evidencias, coordinación interinstitucional y búsqueda forense.",
        "price": 540.00,
        "currency": "USD",
        "category": "Diplomado",
        "image_url": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
        "features": [
            "100% Online",
            "Certificado Internacional",
            "Protocolos de búsqueda",
            "Coordinación interinstitucional",
            "Técnicas forenses"
        ],
        "duration": "120 horas académicas",
        "modules": 10,
        "certificate": True,
        "is_active": True
    },
    {
        "name": "Diplomado Policiología Forense 2025",
        "slug": "diplomado-policiologia-forense-2025",
        "description": "Ciencia policial aplicada al ámbito forense. Criminalística, cadena de custodia, procedimientos policiales, derechos humanos y técnicas de investigación criminal modernas.",
        "price": 540.00,
        "currency": "USD",
        "category": "Diplomado",
        "image_url": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
        "features": [
            "100% Online",
            "Certificado Internacional",
            "Criminalística aplicada",
            "Cadena de custodia",
            "Procedimientos policiales"
        ],
        "duration": "120 horas académicas",
        "modules": 11,
        "certificate": True,
        "is_active": True
    },
    {
        "name": "Diplomado Psicología Criminológica 2025",
        "slug": "diplomado-psicologia-criminologica-2025",
        "description": "Fusión entre psicología y criminología. Comprende la mente criminal, teorías criminológicas, factores psicosociales del delito, victimología y prevención del crimen.",
        "price": 540.00,
        "currency": "USD",
        "category": "Diplomado",
        "image_url": "https://images.unsplash.com/photo-1532635250-fc1dad8c57d9?w=800",
        "features": [
            "100% Online",
            "Certificado Internacional",
            "Teorías criminológicas",
            "Psicología del crimen",
            "Victimología"
        ],
        "duration": "120 horas académicas",
        "modules": 9,
        "certificate": True,
        "is_active": True
    },
    {
        "name": "Diplomado Psicología Forense 2025",
        "slug": "diplomado-psicologia-forense-2025",
        "description": "Psicología aplicada al ámbito jurídico y forense. Evaluación pericial, credibilidad del testimonio, imputabilidad, simulación y elaboración de informes periciales psicológicos.",
        "price": 540.00,
        "currency": "USD",
        "category": "Diplomado",
        "image_url": "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800",
        "features": [
            "100% Online",
            "Certificado Internacional",
            "Evaluación pericial",
            "Informes forenses",
            "Testimonio pericial"
        ],
        "duration": "120 horas académicas",
        "modules": 10,
        "certificate": True,
        "is_active": True
    },
    {
        "name": "Diplomado Psicópatas 2025",
        "slug": "diplomado-psicopatas-2025",
        "description": "Estudio profundo de la psicopatía y sociopatía. Diagnóstico diferencial, evaluación PCL-R, características criminológicas, tratamiento y manejo de personalidades antisociales.",
        "price": 540.00,
        "currency": "USD",
        "category": "Diplomado",
        "image_url": "https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=800",
        "features": [
            "100% Online",
            "Certificado Internacional",
            "Evaluación PCL-R",
            "Diagnóstico diferencial",
            "Casos clínicos"
        ],
        "duration": "120 horas académicas",
        "modules": 8,
        "certificate": True,
        "is_active": True
    }
]


async def seed_products():
    """Seed the database with diplomados"""
    try:
        # Clear existing products (optional - comment out if you want to keep existing)
        # await products_collection.delete_many({})
        
        # Check if products already exist
        existing_count = await products_collection.count_documents({})
        
        if existing_count > 0:
            print(f"Database already has {existing_count} products. Skipping seed.")
            return
        
        # Insert diplomados
        result = await products_collection.insert_many(DIPLOMADOS)
        
        print(f"✅ Successfully seeded {len(result.inserted_ids)} diplomados!")
        print("\nImported products:")
        for i, diplomado in enumerate(DIPLOMADOS, 1):
            print(f"{i}. {diplomado['name']} - ${diplomado['price']}")
    
    except Exception as e:
        print(f"❌ Error seeding products: {str(e)}")
    finally:
        client.close()


if __name__ == "__main__":
    print("🌱 Seeding IDEF diplomados...")
    asyncio.run(seed_products())
