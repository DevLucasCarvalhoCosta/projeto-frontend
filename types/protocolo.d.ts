// protocolo.d.ts
declare namespace Protocolos {
    interface Protocolo {
      id: number;
      numero: string;
      assunto: string;
      conteudo: string;
      dataCriacao?: string;
      statusVotacao: string;
      pdfPath: string;
    }
  }