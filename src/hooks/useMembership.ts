import { useState, useEffect, useCallback } from 'react';
import { api } from '@/services/api';
import { formatRupiah } from '@/utils/formatters';

export function useMembership() {
  const [memberships, setMemberships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMemberships = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.get<any>('/catalog/membership');

      if (result?.success && Array.isArray(result?.data)) {
        const formatted = result.data.map((item: any) => {
          // 1. Terjemahkan icon web ke Ionicons
          let iconName = 'medal';
          if (item.icon?.includes('trophy')) iconName = 'trophy';
          if (item.icon?.includes('crown')) iconName = 'diamond';

          const baseColor = item.color || '#9CA3AF';

          return {
            id: String(item.id),
            name: item.name,
            level: `Level ${item.level}`,
            icon: iconName,
            iconColor: baseColor,
            bgColor: baseColor + '1A', 
            borderColor: baseColor + '66',
            multiplier: `${Number(item.point_multiplier).toFixed(2)}x`,
            minTransaction: formatRupiah(Number(item.min_transaction)),
            dpRule: Number(item.dp_po_per_item) > 0 ? `${formatRupiah(Number(item.dp_po_per_item))} / item` : 'Tanpa DP (Rp 0)',
            description: item.description || ''
          };
        });

        setMemberships(formatted);
      }
    } catch (error) {
      console.log('Error fetch membership:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMemberships();
  }, [loadMemberships]);

  return { memberships, loading, refetch: loadMemberships };
}