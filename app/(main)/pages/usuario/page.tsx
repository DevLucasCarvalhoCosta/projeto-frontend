/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Projeto } from '@/types';
import { UsuarioService } from '@/service/usuarioService';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';

const Crud = () => {
    let usuarioVazio: Projeto.Usuario = {
        id: 0,
        nome: '',
        email: '',
        telefone: '',
        dataNascimento: '',
        genero: null,
        endereco: '',
        cpf: '',
        senha: '',
        cargo: null,
    };

    const [usuarios, setUsuarios] = useState<Projeto.Usuario[] | null>(null);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [usuario, setUsuario] = useState<Projeto.Usuario>(usuarioVazio);
    const [selectedUsuarios, setSelectedUsuarios] = useState<Projeto.Usuario[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const usuarioService = new UsuarioService();

    useEffect(() => {
       usuarioService.listarTodos()
       .then((response) => {
        setUsuarios(response.data);
       }).catch((error) => {
        console.log(error);
       })
    }, []);

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

        if (usuario.nome && usuario.email && usuario.telefone && usuario.dataNascimento && usuario.cpf && usuario.senha && usuario.cargo) {
            if (!usuario.id) {
                usuarioService.inserir(usuario)
                    .then((response) => {
                        setUsuarioDialog(false);
                        setUsuario(usuarioVazio);
                        if (toast.current) {
                            toast.current.show({
                                severity: 'success',
                                summary: 'Successful',
                                detail: 'Usuario cadastrado com sucesso',
                            });
                        }
                    }).catch(error => {
                        console.log(error.data.message);
                        if (toast.current) {
                            toast.current.show({
                                severity: 'error',
                                summary: 'Erro!',
                                detail: 'Erro ao Salvar: ' + error.data.message
                            });
                        }
                    });
            } else {
                // Lógica para atualizar um usuário existente
            }
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
        // Implementar a lógica de exclusão de usuário
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUsuariosDialog(true);
    };

    const deleteSelectedUsuarios = () => {
        // Implementar a lógica de exclusão de usuários selecionados
    };

    const onCargoChange = (e: RadioButtonChangeEvent) => {
        let _usuario = { ...usuario };
        _usuario['cargo'] = e.value;
        setUsuario(_usuario);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _usuario = { ...usuario };
        _usuario[`${name}`] = val;
        setUsuario(_usuario);
    };

    const onCalendarChange = (e: any, name: string) => {
        const val = e.value || null;
        let _usuario = { ...usuario };
        _usuario[`${name}`] = val ? (val instanceof Date ? val.toISOString().substring(0, 10) : val) : null;
        setUsuario(_usuario);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsuarios || !(selectedUsuarios as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Codigo</span>
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

    const cargoBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Cargo</span>
                {rowData.cargo}
            </>
        );
    };

    const generoBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <span className="p-column-title">Genero</span>
                <span className={`product-badge status-${rowData.genero?.toLowerCase()}`}>{rowData.genero}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.Usuario) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUsuario(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUsuario(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Gerenciamento de Usuarios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const usuarioDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveUsuario} />
        </>
    );
    const deleteUsuarioDialogFooter = (
        <>
            <Button label="Nao" icon="pi pi-times" text onClick={hideDeleteUsuarioDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteUsuario} />
        </>
    );
    const deleteUsuariosDialogFooter = (
        <>
            <Button label="Nao" icon="pi pi-times" text onClick={hideDeleteUsuariosDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedUsuarios} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={usuarios}
                        selection={selectedUsuarios}
                        onSelectionChange={(e) => setSelectedUsuarios(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} ate {last} de {totalRecords} usuarios"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum Usuario Encontrado!"
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Codigo" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nomeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="cargo" header="Cargo" sortable body={cargoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="genero" header="Genero" sortable body={generoBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={usuarioDialog} style={{ width: '450px' }} header="Detalhes de Usuario" modal className="p-fluid" footer={usuarioDialogFooter} onHide={hideDialog}>

                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={usuario.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.nome
                                })}
                            />
                            {submitted && !usuario.nome && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={usuario.email}
                                onChange={(e) => onInputChange(e, 'email')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.email
                                })}
                            />
                            {submitted && !usuario.email && <small className="p-invalid">Email é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="telefone">Telefone</label>
                            <InputText
                                id="telefone"
                                value={usuario.telefone || ''}
                                onChange={(e) => onInputChange(e, 'telefone')}
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.telefone
                                })}
                            />
                            {submitted && !usuario.telefone && <small className="p-invalid">Telefone é obrigatório!</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="dataNascimento">Data de Nascimento</label>
                            <Calendar
                                id="dataNascimento"
                                value={usuario.dataNascimento}
                                onChange={(e) => onCalendarChange(e, 'dataNascimento')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.dataNascimento
                                })}
                                dateFormat="dd/mm/yy" // Define o formato de exibição da data
                                showIcon // Mostra um ícone para abrir o calendário
                                monthNavigator // Permite navegar pelos meses
                                yearNavigator // Permite navegar pelos anos
                                yearRange="1900:2100" // Define o intervalo de anos disponíveis
                            />
                            {submitted && !usuario.dataNascimento && <small className="p-invalid">Data de Nascimento é obrigatória!</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="genero">Gênero</label>
                            <Dropdown
                                id="genero"
                                value={usuario.genero}
                                options={[
                                    { label: 'Masculino', value: 'masculino' },
                                    { label: 'Feminino', value: 'feminino' },
                                    { label: 'Outro', value: 'outro' }
                                ]}
                                onChange={(e) => onInputChange(e, 'genero')}
                                placeholder="Selecione o Gênero"
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.genero
                                })}
                            />
                            {submitted && !usuario.genero && <small className="p-invalid">Gênero é obrigatório!</small>}
                        </div>

                        <div className="
field">
                            <label htmlFor="endereco">Endereço</label>
                            <InputText
                                id="endereco"
                                value={usuario.endereco || ''}
                                onChange={(e) => onInputChange(e, 'endereco')}
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.endereco
                                })}
                            />
                            {submitted && !usuario.endereco && <small className="p-invalid">Endereço é obrigatório!</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="cpf">CPF</label>
                            <InputMask
                                id="cpf"
                                mask="999.999.999-99"
                                value={usuario.cpf || ''}
                                onChange={(e) => onInputChange(e, 'cpf')}
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.cpf
                                })}
                            />
                            {submitted && !usuario.cpf && <small className="p-invalid">CPF é obrigatório!</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="senha">Senha</label>
                            <InputText
                                id="senha"
                                type="password"
                                value={usuario.senha}
                                onChange={(e) => onInputChange(e, 'senha')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.senha
                                })}
                            />
                            {submitted && !usuario.senha && <small className="p-invalid">Senha é obrigatória!</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="cargo">Cargo</label>
                            <div className="p-formgroup-inline">
                                <div className="p-field-radiobutton">
                                    <RadioButton
                                        inputId="vereador"
                                        name="cargo"
                                        value="vereador"
                                        onChange={onCargoChange}
                                        checked={usuario.cargo === 'vereador'}
                                    />
                                    <label htmlFor="vereador">Vereador</label>
                                </div>
                                <div className="p-field-radiobutton">
                                    <RadioButton
                                        inputId="presidente"
                                        name="cargo"
                                        value="presidente"
                                        onChange={onCargoChange}
                                        checked={usuario.cargo === 'presidente'}
                                    />
                                    <label htmlFor="presidente">Presidente</label>
                                </div>
                                <div className="p-field-radiobutton">
                                    <RadioButton
                                        inputId="comissao"
                                        name="cargo"
                                        value="comissao"
                                        onChange={onCargoChange}
                                        checked={usuario.cargo === 'comissao'}
                                    />
                                    <label htmlFor="comissao">Comissão</label>
                                </div>
                                <div className="p-field-radiobutton">
                                    <RadioButton
                                        inputId="procurador"
                                        name="cargo"
                                        value="procurador"
                                        onChange={onCargoChange}
                                        checked={usuario.cargo === 'procurador'}
                                    />
                                    <label htmlFor="procurador">Procurador</label>
                                </div>
                                <div className="p-field-radiobutton">
                                    <RadioButton
                                        inputId="prefeito"
                                        name="cargo"
                                        value="prefeito"
                                        onChange={onCargoChange}
                                        checked={usuario.cargo === 'prefeito'}
                                    />
                                    <label htmlFor="prefeito">Prefeito</label>
                                </div>
                                <div className="p-field-radiobutton">
                                    <RadioButton
                                        inputId="assessor"
                                        name="cargo"
                                        value="assessor"
                                        onChange={onCargoChange}
                                        checked={usuario.cargo === 'assessor'}
                                    />
                                    <label htmlFor="assessor">Assessor</label>
                                </div>
                            </div>
                            {submitted && !usuario.cargo && <small className="p-invalid">Cargo é obrigatório!</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Deseja excluir o usuário <b>{usuario.nome}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuariosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuariosDialogFooter} onHide={hideDeleteUsuariosDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {selectedUsuarios && <span>Deseja excluir os usuarios selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
