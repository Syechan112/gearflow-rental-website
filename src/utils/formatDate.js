import { format, parseISO, isValid } from 'date-fns';
import { id } from 'date-fns/locale';

export function formatDate(dateString, pattern = 'dd MMM yyyy') {
  if (!dateString) return '-';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    if (!isValid(date)) return '-';
    return format(date, pattern, { locale: id });
  } catch {
    return '-';
  }
}

export function formatDateTime(dateString) {
  return formatDate(dateString, 'dd MMM yyyy, HH:mm');
}
