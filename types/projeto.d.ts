declare namespace Projeto {
    interface Usuario {
        id: number;
        nome: string;
        email: string;
        telefone?: string | null;
        dataNascimento?: Date;
        genero?: 'masculino' | 'feminino' | 'outro' | null;
        endereco?: string | null;
        cpf?: string | undefined;
        senha: string;
        cargo: 'vereador' | 'presidente' | 'comissao' | 'procurador' | 'prefeito' | 'assessor'| null;
    }

    export interface SessaoPlenaria {
        id: number;
        data: Date | null;
        status: string;
        protocolos: any[]; // Adapte conforme necessário
    }
    
    export interface Protocolo {
        id: number;
        numero: number;
        assunto: string;
        conteudo: string;
        dataCriacao: Date;
        statusVotacao: 'pendente' | 'aprovado' | 'reprovado' | 'nao votado';
        pdfPath: string;
    }
};