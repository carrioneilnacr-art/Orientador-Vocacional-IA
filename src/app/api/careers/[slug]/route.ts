import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  // MOCK details for now
  const careerData = {
    slug,
    name: slug.replace(/-/g, ' ').toUpperCase(),
    faculty: 'Facultad de Prueba',
    description: `Descripción mock para la carrera ${slug}`,
    semesters: 10
  };

  return NextResponse.json(careerData);
}
