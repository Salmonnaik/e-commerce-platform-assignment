import type { Role } from '../types/common';

export const ROLES: Record<Role, Role> = {
  CUSTOMER: 'CUSTOMER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN',
} as const;

export const ROLE_LABELS: Record<Role, string> = {
  CUSTOMER: 'Customer',
  SELLER: 'Seller',
  ADMIN: 'Administrator',
};

export const DEFAULT_ROLE: Role = 'CUSTOMER';

export const SELLER_ROLES: Role[] = ['SELLER', 'ADMIN'];
export const ADMIN_ROLES: Role[] = ['ADMIN'];
