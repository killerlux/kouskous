// apps/admin/src/lib/__tests__/utils.test.ts
import { formatCurrency, formatPhoneNumber, getInitials } from '../utils';

describe('utils', () => {
  describe('formatCurrency', () => {
    it('formats amount in TND', () => {
      expect(formatCurrency(100000)).toBe('1 000,00 TND');
    });

    it('handles zero', () => {
      expect(formatCurrency(0)).toBe('0,00 TND');
    });

    it('handles negative amounts', () => {
      expect(formatCurrency(-50000)).toBe('-500,00 TND');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats Tunisian phone numbers', () => {
      expect(formatPhoneNumber('+21612345678')).toBe('+216 12 345 678');
    });

    it('returns original if not Tunisian', () => {
      expect(formatPhoneNumber('+33123456789')).toBe('+33123456789');
    });

    it('returns original if invalid length', () => {
      expect(formatPhoneNumber('+2161234')).toBe('+2161234');
    });
  });

  describe('getInitials', () => {
    it('gets initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('handles single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    it('handles empty string', () => {
      expect(getInitials('')).toBe('??');
    });

    it('handles null/undefined', () => {
      expect(getInitials(null)).toBe('??');
      expect(getInitials(undefined)).toBe('??');
    });
  });
});

