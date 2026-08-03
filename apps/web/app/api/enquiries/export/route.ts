import { NextResponse } from 'next/server';
import { enquiryQueries } from '@/features/catalog/queries';

export async function GET() {
  const rows = enquiryQueries.getAll();
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
