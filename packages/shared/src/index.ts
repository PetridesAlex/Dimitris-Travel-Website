export const LOCALES = ['en', 'el', 'de', 'fr', 'it', 'es', 'ar'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
export const RTL_LOCALES: Locale[] = ['ar'];

export const USER_ROLES = [
  'super_admin',
  'admin',
  'editor',
  'content_writer',
  'marketing',
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const CONTENT_STATUSES = ['draft', 'published', 'archived'] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

export const DESTINATION_TYPES = ['continent', 'country', 'city'] as const;
export type DestinationType = (typeof DESTINATION_TYPES)[number];

export const ENQUIRY_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'won',
  'lost',
] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const EXPERIENCE_CATEGORIES = [
  'safari',
  'luxury_cruises',
  'private_villas',
  'private_jet',
  'luxury_train',
  'honeymoon',
  'adventure',
  'wellness',
  'family',
  'golf',
  'food_wine',
  'culture',
  'photography',
  'diving',
  'yachting',
  'luxury_escapes',
] as const;
export type ExperienceCategory = (typeof EXPERIENCE_CATEGORIES)[number];

export const EXPERIENCE_CATEGORY_LABELS: Record<ExperienceCategory, string> = {
  safari: 'Safari',
  luxury_cruises: 'Luxury Cruises',
  private_villas: 'Private Villas',
  private_jet: 'Private Jet',
  luxury_train: 'Luxury Train',
  honeymoon: 'Honeymoon',
  adventure: 'Adventure',
  wellness: 'Wellness',
  family: 'Family Holidays',
  golf: 'Golf',
  food_wine: 'Food & Wine',
  culture: 'Culture',
  photography: 'Photography',
  diving: 'Diving',
  yachting: 'Yachting',
  luxury_escapes: 'Luxury Escapes',
};

export type Permission =
  | 'users.manage'
  | 'settings.manage'
  | 'content.create'
  | 'content.edit'
  | 'content.publish'
  | 'content.delete'
  | 'media.upload'
  | 'media.delete'
  | 'blog.manage'
  | 'enquiries.view'
  | 'enquiries.assign'
  | 'enquiries.export'
  | 'seo.manage';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    'users.manage',
    'settings.manage',
    'content.create',
    'content.edit',
    'content.publish',
    'content.delete',
    'media.upload',
    'media.delete',
    'blog.manage',
    'enquiries.view',
    'enquiries.assign',
    'enquiries.export',
    'seo.manage',
  ],
  admin: [
    'settings.manage',
    'content.create',
    'content.edit',
    'content.publish',
    'content.delete',
    'media.upload',
    'media.delete',
    'blog.manage',
    'enquiries.view',
    'enquiries.assign',
    'enquiries.export',
    'seo.manage',
  ],
  editor: [
    'content.create',
    'content.edit',
    'content.publish',
    'media.upload',
    'blog.manage',
    'enquiries.view',
    'seo.manage',
  ],
  content_writer: [
    'content.create',
    'content.edit',
    'media.upload',
    'blog.manage',
  ],
  marketing: ['blog.manage', 'media.upload', 'seo.manage', 'enquiries.view'],
};

export function roleHasPermission(role: UserRole, permission: Permission) {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
