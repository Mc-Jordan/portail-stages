import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { GraduationCap, Building2, Users, BookOpen, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="relative mb-16 overflow-hidden rounded-3xl bg-brand-gradient px-6 py-20 text-center text-white">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <p className="eyebrow text-white/80">Stages universitaires</p>
            <h1 className="mx-auto mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
              Portail de gestion des stages
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
              Mettez en relation étudiants et entreprises, simplifiez les candidatures
              et gérez les conventions de stage en toute simplicité.
            </p>
            <Link href="/login">
              <Button size="lg" className="mt-8 gap-2 bg-white px-8 text-base font-semibold text-brand-700 hover:bg-white/90">
                Commencer
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Roles */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="text-center transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50">
                <GraduationCap className="h-7 w-7 text-brand-600" />
              </div>
              <CardTitle>Étudiants</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Trouvez et postulez aux offres de stage correspondant à votre profil.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-50">
                <Building2 className="h-7 w-7 text-green-600" />
              </div>
              <CardTitle>Entreprises</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Publiez vos offres de stage et recrutez des étudiants talentueux.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50">
                <BookOpen className="h-7 w-7 text-brand-600" />
              </div>
              <CardTitle>Enseignants</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Validez les conventions de stage pour garantir des placements de qualité.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50">
                <Users className="h-7 w-7 text-brand-600" />
              </div>
              <CardTitle>Administrateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gérez la plateforme, les utilisateurs et générez des rapports.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How it works */}
        <div className="text-center">
          <p className="eyebrow">Fonctionnement</p>
          <h2 className="mb-10 mt-2 text-3xl font-bold text-gray-900">Comment ça marche</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">1</div>
              <h3 className="mb-2 text-xl font-semibold">Explorer les offres</h3>
              <p className="text-gray-600">
                Les étudiants recherchent et filtrent les offres selon leurs préférences.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white">2</div>
              <h3 className="mb-2 text-xl font-semibold">Postuler & échanger</h3>
              <p className="text-gray-600">
                Envoyez CV et lettre de motivation. Les entreprises étudient et répondent.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-2xl font-bold text-white">3</div>
              <h3 className="mb-2 text-xl font-semibold">Finaliser la convention</h3>
              <p className="text-gray-600">
                Les enseignants valident la convention et le stage peut commencer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
