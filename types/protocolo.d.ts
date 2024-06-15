// c:/Users/Maquina12/Desktop/Faculdade/projeto-frontend/types/Protocolo.d.ts

declare module 'Protocolo' {
    export interface Protocolo {
      id: number;
      numero: string;
      assunto: string;
      conteudo: string;
      dataCriacao?: string;
      statusVotacao: string;
      pdfPath: string;
    }
  }
  