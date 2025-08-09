export const formatCurrency = (amount: number | string, withPrefix = true): string => {
    const num = typeof amount === 'string' ? Number(amount) : amount;

    if (isNaN(num)) return withPrefix ? 'Rp 0' : '0';

    const [integer, fraction] = String(amount).split('.');

    const formattedInteger = Number(integer).toLocaleString('id-ID');

    const formattedFraction = fraction && parseInt(fraction) > 0 ? `,${fraction}` : '';

    return withPrefix ? `Rp ${formattedInteger}${formattedFraction}` : `${formattedInteger}${formattedFraction}`;
}
