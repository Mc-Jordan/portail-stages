'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InternshipOfferDTO } from '@/types';
import { MapPin, Calendar, Clock, Building2 } from 'lucide-react';
import Link from 'next/link';

interface OfferCardProps {
  offer: InternshipOfferDTO;
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-lg">{offer.title}</CardTitle>
            <CardDescription className="flex items-center">
              <Building2 className="h-4 w-4 mr-1" />
              {offer.companyName}
            </CardDescription>
          </div>
          <Badge variant={offer.status === 'OPEN' ? 'default' : 'secondary'}>
            {offer.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {offer.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {offer.requiredSkills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {offer.requiredSkills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{offer.requiredSkills.length - 3} more
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {offer.location}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {offer.durationInMonths} months
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date(offer.startDate).toLocaleDateString()}
          </div>
          <div className="text-xs">
            Domain: {offer.domain}
          </div>
        </div>

        <div className="pt-2">
          <Button asChild className="w-full">
            <Link href={`/student/offers/${offer.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
