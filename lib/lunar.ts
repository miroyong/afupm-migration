// CIG Lunar Calendar utilities
// Ported from AFUPM Wix site (familias.org.br)
import moment from 'moment';
import 'moment-lunar';

export function formatLunarDate(date: Date, lang: 'pt' | 'es'): string {
  try {
    const locale = lang === 'es' ? 'es' : 'pt-br';
    const lunarDate = moment(date).locale(locale).lunar();
    const cigYear = Number(lunarDate.format('YYYY')) - 2012;

    if (lang === 'es') {
      return `${lunarDate.format('D')}º día del ${lunarDate.format('M')}º mes del ${cigYear}º año del CIG`;
    }
    return `${lunarDate.format('D')}º dia do ${lunarDate.format('M')}º mês do ${cigYear}º ano do CIG`;
  } catch (error) {
    console.error('Error formatting lunar date:', error);
    return lang === 'es' ? 'Fecha lunar no disponible' : 'Data lunar indisponível';
  }
}

export function formatSolarDate(date: Date, lang: 'pt' | 'es'): string {
  const locale = lang === 'es' ? 'es-ES' : 'pt-BR';
  const dayOfWeek = new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
  const dd = date.getDate().toString().padStart(2, '0');
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${dd}.${mm}.${date.getFullYear()} ${dayOfWeek}`;
}
