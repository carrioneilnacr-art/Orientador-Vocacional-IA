import { db } from "@/db";
import { careers, academicOffers, institutions, campuses, tuitionFees } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, DollarSign, Building2, Clock, Award, CheckCircle2 } from "lucide-react";

export default async function CareerDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Fetch career
  const careerData = await db.select().from(careers).where(eq(careers.slug, slug)).limit(1);
  if (!careerData.length) notFound();
  const career = careerData[0];

  // 2. Fetch offers
  const offers = await db
    .select({
      offerId: academicOffers.id,
      modality: academicOffers.modality,
      institutionName: institutions.name,
      institutionShort: institutions.shortName,
      campusName: campuses.name,
      district: campuses.district,
    })
    .from(academicOffers)
    .innerJoin(institutions, eq(academicOffers.institutionId, institutions.id))
    .innerJoin(campuses, eq(academicOffers.campusId, campuses.id))
    .where(eq(academicOffers.careerId, career.id));

  // 3. Fetch fees
  const offerIds = offers.map(o => o.offerId);
  const fees = offerIds.length > 0 
    ? await db.select().from(tuitionFees).where(inArray(tuitionFees.academicOfferId, offerIds))
    : [];

  // Group by institution
  const uniMap = new Map();
  const limaNorteDistricts = new Set(['los olivos', 'comas', 'independencia', 'san martín de porres', 'san martin de porres', 'puente piedra', 'carabayllo']);

  for (const o of offers) {
    if (!uniMap.has(o.institutionShort)) {
      uniMap.set(o.institutionShort, {
        name: o.institutionName,
        short: o.institutionShort,
        campuses: [] as {name: string, isNorte: boolean, district: string}[],
        costs: new Set<string>()
      });
    }
    const uni = uniMap.get(o.institutionShort);
    const distLow = o.district.toLowerCase();
    const isNorte = limaNorteDistricts.has(distLow) || o.campusName.toLowerCase().includes('norte');
    
    // Check if campus already added
    if (!uni.campuses.find((c: any) => c.name === o.campusName)) {
        uni.campuses.push({ name: o.campusName, isNorte, district: o.district });
    }

    // Add cost
    const offerFees = fees.filter(f => f.academicOfferId === o.offerId);
    offerFees.forEach(f => {
       uni.costs.add(`${f.currency} ${f.amount}`);
    });
  }

  const universities = Array.from(uniMap.values());

  return (
    <div className="min-h-screen bg-[#F8FCFF] text-[#082A4A] font-sans">
      {/* Header / Nav */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#D6E5EF]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center">
          <Link href="/resultados" className="flex items-center gap-2 text-[#4F6B85] hover:text-[#00C2E0] transition-colors font-medium text-sm">
            <ArrowLeft className="w-4 h-4" />
            Volver a resultados
          </Link>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10">
        {/* Career Hero */}
        <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-sm border border-[#D6E5EF] mb-10">
          <div className="inline-block px-3 py-1 bg-[#EAF6FF] rounded-lg text-xs font-bold text-[#00C2E0] uppercase tracking-wider mb-4">
            {career.faculty}
          </div>
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#082A4A] mb-4 leading-tight">
            {career.name}
          </h1>
          <p className="text-[#4F6B85] text-[16px] leading-relaxed max-w-4xl mb-8">
            {career.generalProfile || "Una carrera diseñada para formar profesionales capaces de afrontar los retos del futuro con tecnología e innovación."}
          </p>

          <div className="flex flex-wrap gap-6 text-sm font-medium border-t border-[#D6E5EF] pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#00C2E0]" />
              <span>{career.durationYears} años ({career.durationSemesters} semestres)</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#00C2E0]" />
              <span>{career.degree}</span>
            </div>
          </div>
        </div>

        {/* Universities Comparison */}
        <div className="mb-12">
          <h2 className="text-[24px] font-bold text-[#082A4A] mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#00C2E0]" />
            ¿Dónde puedes estudiarlo?
          </h2>

          {universities.length === 0 ? (
            <div className="bg-white rounded-[20px] p-8 text-center border border-[#D6E5EF] shadow-sm">
              <p className="text-[#4F6B85]">Aún no tenemos universidades registradas que ofrezcan esta carrera específica en nuestra base de datos verificada.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {universities.map((uni, idx) => (
                <div key={idx} className="bg-white rounded-[20px] p-6 shadow-sm border border-[#D6E5EF] hover:shadow-md transition-all flex flex-col">
                  <div className="mb-5 border-b border-[#F0F5F9] pb-4">
                    <h3 className="text-[22px] font-bold text-[#082A4A]">{uni.short}</h3>
                    <p className="text-[13px] text-[#4F6B85] mt-1">{uni.name}</p>
                  </div>

                  <div className="flex-1 space-y-5">
                    {/* Sedes */}
                    <div>
                      <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#082A4A] mb-2">
                        <MapPin className="w-4 h-4 text-[#00C2E0]" />
                        Sedes Disponibles
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {uni.campuses.map((campus: any, cIdx: number) => (
                          <span 
                            key={cIdx} 
                            className={`text-[12px] px-2.5 py-1 rounded-md font-medium border ${campus.isNorte ? 'bg-[#00C2E0]/10 border-[#00C2E0]/20 text-[#009BB3]' : 'bg-[#F8FCFF] border-[#D6E5EF] text-[#4F6B85]'}`}
                          >
                            {campus.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Costos */}
                    <div>
                      <div className="flex items-center gap-1.5 text-[13px] font-bold text-[#082A4A] mb-2">
                        <DollarSign className="w-4 h-4 text-[#00C2E0]" />
                        Inversión aproximada
                      </div>
                      <p className="text-[13px] text-[#4F6B85]">
                        {uni.costs.size > 0 
                          ? Array.from(uni.costs).join(" - ")
                          : "Consultar en admisión"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
