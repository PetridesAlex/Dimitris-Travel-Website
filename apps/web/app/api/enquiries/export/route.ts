import { NextResponse } from 'next/server';
import { getCmsSession } from '@/lib/cms/auth';
import { enquiryQueries } from '@/features/catalog/queries';

export async function GET() {
  const session = await getCmsSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rows = await enquiryQueries.getAll();
  const header = [
    'id',
    'fullName',
    'email',
    'phone',
    'destination',
    'travelDate',
    'budget',
    'adults',
    'children',
    'travelStyle',
    'status',
    'createdAt',
  ];

  const escape = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

  const lines = [
    header.join(','),
    ...rows.map((r) =>
      [
        r.id,
        r.fullName,
        r.email,
        r.phone,
        r.destination,
        r.travelDate,
        r.budget,
        r.adults,
        r.children,
        r.travelStyle,
        r.status,
        r.createdAt,
      ]
        .map(escape)
        .join(','),
    ),
  ];

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="enquiries.csv"',
    },
  });
}
