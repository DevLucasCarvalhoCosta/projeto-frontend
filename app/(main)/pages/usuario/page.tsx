'use client';

import React, { useEffect, useRef, useState, ChangeEvent } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { UsuarioService } from '@/service/usuarioService';
import { Projeto } from '@/types';

const Crud = () => {
    let usuarioVazio: Projeto.Usuario = {
        id: 0,
        nome: '',
        email: '',
        telefone: '',
        dataNascimento: undefined,
        genero: null,
        endereco: '',
        cpf: undefined,
        senha: '',
        cargo: null,
        perfilId: 0,
    };

    const [usuarios, setUsuarios] = useState<Projeto.Usuario[] | null>(null);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [usuario, setUsuario] = useState<Projeto.Usuario>(usuarioVazio);
    const [selectedUsuarios, setSelectedUsuarios] = useState<Projeto.Usuario[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const usuarioService = new UsuarioService();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setIsAuthenticated(true);
            fetchUsuarios();
        }
    }, []);

    const fetchUsuarios = () => {
        usuarioService.listarTodos()
            .then((response) => {
                console.log(response.data);
                setUsuarios(response.data);
            })
            .catch((error) => {
                console.log(error);
                if (toast.current) {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao buscar usuários: ' + error.message
                    });
                }
            });
    };

    const openNew = () => {
        setUsuario(usuarioVazio);
        setSubmitted(false);
        setUsuarioDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUsuarioDialog(false);
    };

    const hideDeleteUsuarioDialog = () => {
        setDeleteUsuarioDialog(false);
    };

    const hideDeleteUsuariosDialog = () => {
        setDeleteUsuariosDialog(false);
    };

    const saveUsuario = () => {
        setSubmitted(true);

        if (!usuario.id) {
            usuarioService.inserir(usuario)
                .then((response) => {
                    fetchUsuarios();
                    setUsuarioDialog(false);
                    setUsuario(usuarioVazio);
                    if (toast.current) {
                        toast.current.show({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Usuário cadastrado com sucesso',
                        });
                    }
                }).catch((error) => {
                    console.log(error);
                    if (toast.current) {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Erro!',
                            detail: 'Erro ao Salvar: ' + error.message
                        });
                    }
                });
        } else {
            usuarioService.alterar(usuario)
                .then((response) => {
                    fetchUsuarios();
                    setUsuarioDialog(false);
                    setUsuario(usuarioVazio);
                    toast.current?.show({
                        severity: 'info',
                        summary: 'Sucesso!',
                        detail: 'Usuário alterado com sucesso!'
                    });
                }).catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao alterar: ' + error.message
                    });
                });
        }
    };

    const editUsuario = (usuario: Projeto.Usuario) => {
        setUsuario({ ...usuario });
        setUsuarioDialog(true);
    };

    const confirmDeleteUsuario = (usuario: Projeto.Usuario) => {
        setUsuario(usuario);
        setDeleteUsuarioDialog(true);
    };

    const deleteUsuario = () => {
        if (usuario.id) {
          usuarioService.excluir(usuario.id)
            .then((response) => {
              fetchUsuarios();
              setUsuario(usuarioVazio);
              setDeleteUsuarioDialog(false);
              toast.current?.show({
                severity: 'success',
                summary: 'Sucesso!',
                detail: 'Usuário deletado com sucesso!',
                life: 3000
              });
            })
            .catch((error) => {
              toast.current?.show({
                severity: 'error',
                summary: 'Erro!',
                detail: error.response?.data?.erro || 'Erro ao deletar o usuário!',
                life: 3000
              });
            });
        } else {
          toast.current?.show({
            severity: 'error',
            summary: 'Erro!',
            detail: 'ID do usuário não fornecido!',
            life: 3000
          });
        }
      };
    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsuariosDialog(true);
    };

    const deleteSelectedUsuarios = () => {
        // Implementação para deletar múltiplos usuários
    };

    const onCargoChange = (e: RadioButtonChangeEvent) => {
        let _usuario = { ...usuario };
        _usuario['cargo'] = e.value;
        setUsuario(_usuario);
    };

    const onPerfilChange = (e: RadioButtonChangeEvent) => {
        let _usuario = { ...usuario };
        _usuario['perfilId'] = e.value;
        setUsuario(_usuario);
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target as HTMLInputElement).value || '';
        let _usuario = { ...usuario };
        (_usuario as any)[name] = val;

        setUsuario(_usuario);
    };

    const onInputMaskChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target as HTMLInputElement).value || '';
        let _usuario = { ...usuario };
        (_usuario as any)[name] = val;
    
        setUsuario(_usuario);
    };    

    const onInputGeneroChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target as HTMLInputElement).value || '';
        let _usuario = { ...usuario };
        (_usuario as any)[name] = val;

        setUsuario(_usuario);
    };

    const onDateChange = (e: any) => {
        const calendarValue = e.value;
        let _usuario = { ...usuario };
        _usuario.dataNascimento = calendarValue;
        setUsuario(_usuario);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    {/* <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsuarios || !(selectedUsuarios as any).length} /> */}
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };

    const nomeBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };

    const emailBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };

    const telefoneBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Telefone</span>
                {rowData.telefone}
            </>
        );
    };

    const dataNascimentoBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Data de Nascimento</span>
                {rowData.dataNascimento ? new Date(rowData.dataNascimento).toLocaleDateString('pt-BR') : 'Data não disponível'}
            </>
        );
    };

    const enderecoBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Endereço</span>
                {rowData.endereco}
            </>
        );
    };

    const cpfBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">CPF</span>
                {rowData.cpf}
            </>
        );
    };

    const generoBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Gênero</span>
                {rowData.genero}
            </>
        );
    };

    const cargoBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Cargo</span>
                {rowData.cargo}
            </>
        );
    };

    const perfilBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Perfil</span>
                {rowData.perfilId}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <div className="flex justify-content-center">
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" severity="danger" rounded onClick={() => confirmDeleteUsuario(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex justify-content-between">
            <h5 className="m-0">Usuários</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)} placeholder="Pesquisar..." />
            </span>
        </div>
    );

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" onClick={saveUsuario} />
        </>
    );

    const deleteUsuarioDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteUsuario} />
        </>
    );

    const deleteUsuariosDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" outlined onClick={hideDeleteUsuariosDialog} />
            <Button label="Sim" icon="pi pi-check" severity="danger" onClick={deleteSelectedUsuarios} />
        </>
    );

    if (!isAuthenticated) {
        return (
            <div className="card">
                <h5>Você não está autenticado!</h5>
            </div>
        );
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={usuarios || []}
                        selection={selectedUsuarios || []}
                        onSelectionChange={(e) => setSelectedUsuarios(e.value as Projeto.Usuario[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuários"
                        globalFilter={globalFilter || undefined}
                        header={header}
                        responsiveLayout="scroll"
                        emptyMessage="Nenhum usuário encontrado."
                    >
                        <Column selectionMode="multiple" exportable={false}></Column>
                        <Column field="id" header="Id" body={idBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="nome" header="Nome" body={nomeBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="email" header="Email" body={emailBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="telefone" header="Telefone" body={telefoneBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="dataNascimento" header="Data de Nascimento" body={dataNascimentoBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="endereco" header="Endereço" body={enderecoBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="cpf" header="CPF" body={cpfBodyTemplate} sortable style={{ minWidth: '16rem' }}></Column>
                        <Column field="genero" header="Gênero" body={generoBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="cargo" header="Cargo" body={cargoBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="perfil" header="Perfil" body={perfilBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
                    </DataTable>

                    <Dialog visible={usuarioDialog} style={{ width: '450px' }} header="Cadastrar Usuário" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText id="nome" value={usuario.nome} onChange={(e) => onInputChange(e, 'nome')} required autoFocus className={classNames({ 'p-invalid': submitted && !usuario.nome })} />
                            {submitted && !usuario.nome && <small className="p-error">Nome é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={usuario.email} onChange={(e) => onInputChange(e, 'email')} required className={classNames({ 'p-invalid': submitted && !usuario.email })} />
                            {submitted && !usuario.email && <small className="p-error">Email é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="telefone">Telefone</label>
                            <InputText id="telefone" value={usuario.telefone ?? ''} onChange={(e) => onInputChange(e, 'telefone')} required className={classNames({ 'p-invalid': submitted && !usuario.telefone })} />
                            {submitted && !usuario.telefone && <small className="p-error">Telefone é obrigatório.</small>}
                        </div>


                        <div className="field">
                            <label htmlFor="dataNascimento">Data de Nascimento</label>
                            <Calendar
    id="dataNascimento"
    value={usuario.dataNascimento}
    onChange={onDateChange}
    dateFormat="dd/mm/yy"
    showIcon
    className={classNames({ 'p-invalid': submitted && !usuario.dataNascimento })}
/>
                            {submitted && !usuario.dataNascimento && <small className="p-error">Data de Nascimento é obrigatória.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="genero">Gênero</label>
                            <InputText id="genero" value={usuario.genero || ''} onChange={(e) => onInputGeneroChange(e, 'genero')} required className={classNames({ 'p-invalid': submitted && !usuario.genero })} />
                            {submitted && !usuario.genero && <small className="p-error">Gênero é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="endereco">Endereço</label>
                            <InputText id="endereco" value={usuario.endereco ?? ''} onChange={(e) => onInputChange(e, 'endereco')} required className={classNames({ 'p-invalid': submitted && !usuario.endereco })} />
                            {submitted && !usuario.endereco && <small className="p-error">Endereço é obrigatório.</small>}
                       </div>


                        <div className="field">
                            <label htmlFor="cpf">CPF</label>
                            <InputText id="cpf" value={usuario.cpf || ''} onChange={(e) => onInputMaskChange(e, 'cpf')} required className={classNames({ 'p-invalid': submitted && !usuario.cpf })} />
                            {submitted && !usuario.cpf && <small className="p-error">CPF é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="senha">Senha</label>
                            <InputText id="senha" type="password" value={usuario.senha} onChange={(e) => onInputChange(e, 'senha')} required className={classNames({ 'p-invalid': submitted && !usuario.senha })} />
                            {submitted && !usuario.senha && <small className="p-error">Senha é obrigatória.</small>}
                        </div>

                        <div className="field">
                            <label className="mb-3">Cargo</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="vereador" name="cargo" value="vereador" onChange={onCargoChange} checked={usuario.cargo === 'vereador'} />
                                    <label htmlFor="vereador">Vereador</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="presidente" name="cargo" value="presidente" onChange={onCargoChange} checked={usuario.cargo === 'presidente'} />
                                    <label htmlFor="presidente">Presidente</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="comissao" name="cargo" value="comissao" onChange={onCargoChange} checked={usuario.cargo === 'comissao'} />
                                    <label htmlFor="comissao">Comissao</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="procurador" name="cargo" value="procurador" onChange={onCargoChange} checked={usuario.cargo === 'procurador'} />
                                    <label htmlFor="procurador">Procurador</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="prefeito" name="cargo" value="prefeito" onChange={onCargoChange} checked={usuario.cargo === 'prefeito'} />
                                    <label htmlFor="prefeito">Prefeito</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="assessor" name="cargo" value="assessor" onChange={onCargoChange} checked={usuario.cargo === 'assessor'} />
                                    <label htmlFor="assessor">Assessor</label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="field">
                            <label htmlFor="perfil">Perfil</label>
                            <div className="formgroup-inline">
                                <div className="field-radiobutton">
                                    <RadioButton inputId="Prefeito" name="perfilId" value="4" onChange={onPerfilChange} />
                                    <label htmlFor="Prefeito">Prefeito</label>
                                </div>
                                <div className="field-radiobutton">
                                    <RadioButton inputId="Administrador" name="perfilId" value="1" onChange={onPerfilChange}/>
                                    <label htmlFor="Administrador">Administrador</label>
                                </div>
                                <div className="field-radiobutton">
                                    <RadioButton inputId="Usuário" name="perfilId" value="2" onChange={onPerfilChange} />
                                    <label htmlFor="Usuário">Usuário</label>
                                </div>
                                <div className="field-radiobutton">
                                    <RadioButton inputId="Mesadiretora" name="perfilId" value="3" onChange={onPerfilChange}/>
                                    <label htmlFor="Mesadiretora">Mesadiretora</label>
                                </div>
                                <div className="field-radiobutton">
                                    <RadioButton inputId="Acessor" name="perfilId" value="5" onChange={onPerfilChange}/>
                                    <label htmlFor="Acessor">Acessor</label>
                                </div>
                                
                            </div>
                        </div>
                                                
                    </Dialog>

                    <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Tem certeza que deseja deletar <b>{usuario.nome}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuariosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuariosDialogFooter} onHide={hideDeleteUsuariosDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Tem certeza que deseja deletar os usuários selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
