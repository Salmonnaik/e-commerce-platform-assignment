import type { Role } from '../types/common';
import { ADMIN_ROLES, ROLES, SELLER_ROLES } from '../constants/roles';

export function hasRole(userRole: Role | undefined, allowedRoles: Role[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

export function isCustomer(role: Role | undefined): boolean {
  return role === ROLES.CUSTOMER;
}

export function isSeller(role: Role | undefined): boolean {
  return role === ROLES.SELLER;
}

export function isAdmin(role: Role | undefined): boolean {
  return role === ROLES.ADMIN;
}

export function canAccessSellerDashboard(role: Role | undefined): boolean {
  if (!role) return false;
  return hasRole(role, SELLER_ROLES);
}

export function canAccessAdminDashboard(role: Role | undefined): boolean {
  if (!role) return false;
  return hasRole(role, ADMIN_ROLES);
}

export function canManageProducts(role: Role | undefined): boolean {
  return hasRole(role!, [...SELLER_ROLES, ...ADMIN_ROLES]);
}

export function canManageCategories(role: Role | undefined): boolean {
  return isAdmin(role);
}

export function canCancelOrder(role: Role | undefined, isOwner: boolean): boolean {
  return isOwner || isAdmin(role);
}
