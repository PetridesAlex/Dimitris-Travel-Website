/** Rich editorial bodies used when CMS/demo copy is still a short stub. */

export const blogArticleBodies: Record<string, string> = {
  'first-timers-japan': `Japan rewards thoughtful pacing. The country reveals itself slowly — not through rushing between landmarks, but through the spaces in between: a quiet garden at dusk, a counter meal with eight perfect courses, a train window that frames mountains and rice fields in soft afternoon light.

Begin in Tokyo, where the energy of the city can feel overwhelming at first. We favour neighbourhoods that give you both pulse and pause — a ryokan-inspired stay near a shrine, a private guide who knows when to lean into the crowds and when to slip down a side street. Carve space for Hakone early. The onsen ritual, lake views, and kaiseki dining reset the trip before Kyoto asks you to linger.

Kyoto is not a checklist. It is a rhythm. Temples at opening hour, tea houses that still feel like secrets, and evenings that belong to the neighbourhood rather than the guidebook. First-time travellers often try to see too much; the journeys that stay with people are the ones that leave room to breathe.

Seasons matter more here than almost anywhere else. Cherry blossom and autumn foliage draw the world, but late spring and early winter offer clearer light, quieter paths, and stays that feel genuinely yours. Tell us how you like to travel — culinary, cultural, contemplative — and we shape the itinerary around that, not around a template.

Luxury in Japan is rarely loud. It is precision, hospitality, and the feeling that someone has thought carefully about every transition. That is the standard we hold ourselves to.`,

  'morocco-in-spring': `Spring softens Morocco’s edges. Marrakech is vibrant without the peak heat of summer, the High Atlas valleys bloom with wildflowers, and the desert nights are cool enough for long dinners under a sky thick with stars. For travellers who want atmosphere without compromise, March through May is the season we return to again and again.

Start in the medina, but do not rush it. A well-chosen riad — courtyard shade, rooftop views, a host who knows which alleys still feel local — turns the city into something intimate rather than overwhelming. Mornings belong to private guides who open doors: palaces before the crowds, Majorelle when the light is still soft, souks approached with curiosity rather than obligation.

Then leave the city. The drive into the Atlas is part of the story — terraced villages, mint tea stops, and passes that open onto valleys still green from winter rain. We pace these days carefully. Too many lodges try to compress the mountains into a single night; we prefer time to walk, to sit, to watch the light change on the ridgelines.

The desert arrives gradually. By the time you reach the dunes, the noise of the city has fallen away. Camp here should feel considered: proper beds, a proper table, silence that is intentional rather than sparse. Sunrise and sunset are the ceremonies. Everything else — the camel trek, the music, the fire — is optional punctuation.

Spring also means fewer peak-season crowds at the places worth visiting. You can linger at a kasbah terrace without negotiating for space, and dinners can run late because the air still holds a chill worth a scarf. If you have been waiting for the “right” time to see Morocco, this is it — mild days, blooming valleys, and desert nights that feel like the reason you travelled.`,

  'private-villas-mediterranean': `For families and friends travelling together, a villa can be the most luxurious choice — not because it is larger than a hotel suite, but because it gives you a private world. A chef who knows your preferences. A pool that is yours from morning to midnight. A boat waiting when the coast calls. Absolute privacy, without sacrificing the care of a five-star stay.

Along the Mediterranean, we look for houses with character as much as credentials. Staffed villas on the Amalfi Coast, in Provence, or above the Aegean that feel lived-in rather than staged. The best ones sit slightly apart from the postcard crowds: a path to a quiet cove, a terrace that catches the last light, kitchens designed for long, unhurried meals.

Multi-generational travel needs a different kind of planning. Grandparents want ease; teenagers want freedom; parents want both to coexist. A villa solves the logistics that hotels cannot — shared mornings, separate wings, a table big enough for everyone, and evenings that do not require a reservation scramble. We arrange the invisible architecture: transfers, provisioning, local guides, and the experiences that make the week feel like more than a beautiful house.

Boats change the geography. A day along the coast, a picnic in a cove you cannot reach by road, a sunset return with the villa lights coming on above the water. These are the moments guests remember — not the thread count, but the feeling that the trip was designed around them.

If you are gathering people you love in one place, start with the house, then build the journey outward. We will handle the rest.`,
};

export function resolveBlogBody(slug: string, body: string): string {
  const trimmed = body.trim();
  const isStub =
    trimmed.length < 280 ||
    trimmed.endsWith('...') ||
    /^[\s\S]{0,120}\.\.\.$/.test(trimmed);
  if (isStub && blogArticleBodies[slug]) {
    return blogArticleBodies[slug];
  }
  return trimmed || blogArticleBodies[slug] || '';
}

export function formatBlogDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function estimateReadingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 200));
}

export function splitBlogParagraphs(body: string): string[] {
  return body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}
