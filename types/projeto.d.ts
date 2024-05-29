declare namespace Projeto {
    interface Usuario {
        id: number;
        nome: string;
        email: string;
        telefone?: string | null;
        dataNascimento?: string | null;
        genero?: 'masculino' | 'feminino' | 'outro' | null;
        endereco?: string | null;
        cpf?: string | null;
        senha: string;
        cargo: 'vereador' | 'presidente' | 'comissao' | 'procurador' | 'prefeito' | 'assessor'| null;;
    }
};