import type { Metadata } from 'next';
import { WorldExploreMap } from '@/components/marketing/world-explore-map';

export const metadata: Metadata = {
  title: 'Explore the World',
  description:
    'Interactive world map of Uncharted Journeys destinations — explore continents and discover tailor-made countries to visit.',
};

export default async function ExplorePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <WorldExploreMap locale={locale} />;
}
