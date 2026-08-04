import { CITY_IMAGE_MAP } from '@/data/destination-cities';

/**
 * Guaranteed destination imagery — used when CMS hero media is missing.
 */
const FALLBACK =
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1400&q=80';

/** Keys: destination slug (last segment) or full slugPath */
export const DESTINATION_IMAGES: Record<string, string> = {
  // Continents
  americas:
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1400&q=80',
  asia: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1400&q=80',
  africa:
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=80',
  europe:
    'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=1400&q=80',
  oceania:
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80',

  // Americas countries
  'united-states':
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1400&q=80',
  canada:
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1400&q=80',
  mexico:
    'https://images.unsplash.com/photo-1518105779142-d975f22dec20?w=1400&q=80',
  brazil:
    'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=1400&q=80',
  peru: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1400&q=80',
  colombia:
    'https://images.unsplash.com/photo-1534943441045-10045f3f6554?w=1400&q=80',
  argentina:
    'https://images.unsplash.com/photo-1612294037637-ec328d0e51a1?w=1400&q=80',
  'costa-rica':
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1400&q=80',

  // Asia countries
  japan:
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=80',
  thailand:
    'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1400&q=80',
  indonesia:
    'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&q=80',
  philippines:
    'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1400&q=80',
  vietnam:
    'https://images.unsplash.com/photo-1528127269322-539801943592?w=1400&q=80',
  'south-korea':
    'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=1400&q=80',
  china:
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1400&q=80',
  maldives:
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1400&q=80',
  india:
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1400&q=80',
  nepal:
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1400&q=80',
  'sri-lanka':
    'https://images.unsplash.com/photo-1540206395-68808572332f?w=1400&q=80',
  'united-arab-emirates':
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1400&q=80',
  jordan:
    'https://images.unsplash.com/photo-1548786811-dd6e453ccca7?w=1400&q=80',

  // Africa countries
  kenya:
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=80',
  tanzania:
    'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1400&q=80',
  'south-africa':
    'https://images.unsplash.com/photo-1484318571209-661cf29a69c3?w=1400&q=80',
  morocco:
    'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=1400&q=80',
  egypt:
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1400&q=80',
  mauritius:
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1400&q=80',
  seychelles:
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=80',

  // Europe countries
  italy:
    'https://images.unsplash.com/photo-1534113414509-0eec2bfb493f?w=1400&q=80',
  switzerland:
    'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=1400&q=80',
  iceland:
    'https://images.unsplash.com/photo-1531168556467-80aace8d0a0b?w=1400&q=80',
  norway:
    'https://images.unsplash.com/photo-1507272931001-fc06c17e4b2a?w=1400&q=80',
  finland:
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400&q=80',
  greece:
    'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1400&q=80',
  spain:
    'https://images.unsplash.com/photo-1543783207-ec64e4d953a9?w=1400&q=80',
  portugal:
    'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1400&q=80',
  france:
    'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1400&q=80',
  austria:
    'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=1400&q=80',

  // Oceania countries
  australia:
    'https://images.unsplash.com/photo-1506973035872-a4ff01bbaa92?w=1400&q=80',
  'new-zealand':
    'https://images.unsplash.com/photo-1469521669194-babb389a6649?w=1400&q=80',
  'french-polynesia':
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=80',
  fiji: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=80',

  // All curated cities
  ...CITY_IMAGE_MAP,
};

function slugFromHref(href?: string) {
  if (!href) return '';
  const parts = href.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '';
}

/**
 * Treat blank / placeholder CMS values as missing so fallbacks apply.
 */
function isUsableImageUrl(url: string) {
  const current = url.trim();
  if (!current || current === 'null' || current === 'undefined' || current === '/') {
    return false;
  }
  return current.startsWith('http://') || current.startsWith('https://') || current.startsWith('/');
}

export function resolveDestinationImage(opts: {
  image?: string | null;
  slug?: string | null;
  slugPath?: string | null;
  href?: string | null;
  name?: string | null;
}): string {
  const current = (opts.image ?? '').trim();
  if (isUsableImageUrl(current)) return current;

  const slug = (opts.slug ?? '').trim();
  const slugPath = (opts.slugPath ?? '').trim();
  const fromHref = slugFromHref(opts.href ?? undefined);
  const nameKey = (opts.name ?? '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9-]/g, '');

  const keys = [
    slugPath,
    slug,
    fromHref,
    nameKey,
    slugPath.split('/').pop(),
    nameKey.replace(/-and-/g, '-'),
  ].filter(Boolean) as string[];

  for (const key of keys) {
    const hit = DESTINATION_IMAGES[key];
    if (hit) return hit;
  }

  return FALLBACK;
}
