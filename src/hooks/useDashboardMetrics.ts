'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState({
    edificios: 0,
    ticketsPendientes: 0,
    ticketsUrgentes: 0,
    tiempoTickets: '0 horas'
  });

  useEffect(() => {
    async function fetchMetrics() {
      const edificios = await supabase.from('edificios').select('*', { count: 'exact' });
      const ticketsPendientes = await supabase.from('tickets')
        .select('*', { count: 'exact' })
        .eq('status', 'abierto');
      const ticketsUrgentes = await supabase.from('tickets')
        .select('*', { count: 'exact' })
        .eq('ticket_type', 'urgencia')
        .eq('status', 'abierto');

      setMetrics({
        edificios: edificios.count || 0,
        ticketsPendientes: ticketsPendientes.count || 0,
        ticketsUrgentes: ticketsUrgentes.count || 0,
        tiempoTickets: '0 horas'
      });
    }

    fetchMetrics();
  }, []);

  return metrics;
}