export const formatRupiah = (angka: number): string => {
  if (angka === undefined || angka === null) return 'Rp0';
  return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};