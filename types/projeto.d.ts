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
};