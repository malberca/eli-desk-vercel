// src/components/Totalizadores.tsx
import React from 'react';

interface TotalizadorProps {
  titulo: string;
  valor: string | number;
  icono: string;
}

function Totalizador({ titulo, valor, icono }: TotalizadorProps) {
  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-400 text-sm">{titulo}</h3>
          <p className="text-2xl font-bold">{valor}</p>
        </div>
        <span className="text-3xl">{icono}</span>
      </div>
    </div>
  );
}

interface TotalizadoresProps {
  datos: {
    edificios: number;
    ticketsPendientes: number;
    ticketsUrgentes: number;
    tiempoTickets: string;
  };
}

export function Totalizadores({ datos }: TotalizadoresProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Totalizador 
        titulo="Edificios Activos" 
        valor={datos.edificios} 
        icono="🏢" 
      />
      <Totalizador 
        titulo="Tickets Pendientes" 
        valor={datos.ticketsPendientes} 
        icono="⏰" 
      />
      <Totalizador 
        titulo="Tickets Urgentes" 
        valor={datos.ticketsUrgentes} 
        icono="🚨" 
      />
      <Totalizador 
        titulo="Tiempo Promedio Resolución" 
        valor={datos.tiempoTickets} 
        icono="🕒" 
      />
    </div>
  );
}