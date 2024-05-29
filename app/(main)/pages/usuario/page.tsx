/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../../demo/service/ProductService';
import { Demo } from '@/types';
import { Projeto } from '@/types';
import { UsuarioService } from '@/service/usuarioService';
import { error } from 'console';
import { Calendar, CalendarViewChangeEvent } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { ChangeEvent } from 'react';


/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
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
    };

    const [usuarios, setUsuarios] = useState(null);
    const [usuarioDialog, setUsuarioDialog] = useState(false);
    const [deleteUsuarioDialog, setDeleteUsuarioDialog] = useState(false);
    const [deleteUsuariosDialog, setDeleteUsuariosDialog] = useState(false);
    const [usuario, setUsuario] = useState<Projeto.Usuario>(usuarioVazio);
    const [selectedUsuarios, setSelectedUsuarios] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const usuarioService = new UsuarioService();

    useEffect(() => {
        usuarioService.listarTodos()
            .then((Response) => {
                console.log(Response.data);
                setUsuarios(Response.data);
            }).catch((error) => {
                console.log(error);
            });
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

        if (!usuario.id) {
            usuarioService.inserir(usuario)
                .then((response) => {
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
                setUsuarioDialog(false);
                setUsuario(usuarioVazio);
                setUsuarios(null);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso!',
                    detail: 'Usuário alterado com sucesso!'
                });
            }).catch((error) => {
                console.log(error.data.message);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao alterar!' + error.data.message
      })
                })
        }
    }

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
            usuarioService.excluir(usuario.id).then((response) => {
                setUsuario(usuarioVazio);
                setDeleteUsuarioDialog(false);
                setUsuarios(null);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Usuário Deletado com Sucesso!',
                    life: 3000
                });
                window.location.reload();
            }).catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao deletar o usuário!',
                    life: 3000
                });
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
        // let _products = (products as any)?.filter((val: any) => !(selectedProducts as any)?.includes(val));
        // setProducts(_products);
        // setDeleteProductsDialog(false);
        // setSelectedProducts(null);
        // toast.current?.show({
        //     severity: 'success',
        //     summary: 'Successful',
        //     detail: 'Products Deleted',
        //     life: 3000
        // });
    };

    const onCargoChange = (e: RadioButtonChangeEvent) => {
        let _usuario = { ...usuario };
        _usuario['cargo'] = e.value;
        setUsuario(_usuario);
    };

    const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = e.target.value || ''; // Adjusted to use 'e.target.value'
        let _usuario = { ...usuario };
        (_usuario as any)[name] = val;
    
        setUsuario(_usuario);
    };
    const onInpumasktChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
        const val = e.target.value || '';
        let _usuario = { ...usuario };
        (_usuario as any)[name] = val;
    
        setUsuario(_usuario);
    };
    const onInpugeneroChange = (e: ChangeEvent<HTMLInputElement>, name: string) => {
        const val = e.target.value || '';
        let _usuario = { ...usuario };
        (_usuario as any)[name] = val;
    
        setUsuario(_usuario);
    };
    
    
    const onDateChange = (e: React.SyntheticEvent) => {
        const calendarValue = (e.target as HTMLInputElement).value;
        let _usuario = { ...usuario };
        _usuario.dataNascimento = new Date(calendarValue.split('/').reverse().join('-')); // Converter dd/mm/yy para yyyy-mm-dd
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
                        onSelectionChange={(e) => setSelectedUsuarios(e.value as any)}
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
                            {submitted && !usuario.nome && <small className="p-invalid">Nome e obrigatorio.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="nome">Email</label>
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
                            {submitted && !usuario.email && <small className="p-invalid">Email e obrigatorio.</small>}
                        </div>

                        
                        <div className="field">
                            <label htmlFor="dataNascimento">Data de Nascimento</label>
                            <Calendar
                                id="dataNascimento"
                                value={usuario.dataNascimento}
                                onChange={(e: any) => onInputChange(e, 'dataNascimento')}
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.dataNascimento
                                })}
                                dateFormat="dd/mm/yy"
                                showIcon
                                monthNavigator
                                yearNavigator
                                yearRange="1900:2100"
                            />
                            {submitted && !usuario.dataNascimento && <small className="p-invalid">Data de Nascimento é Obrigatória!</small>}
                        </div>


                    <div className="field">
                            <label htmlFor="genero">Gênero</label>
                            <Dropdown
                                id="genero"
                                value={usuario.genero}
                                options={[{ label: 'Masculino', value: 'Masculino' }, { label: 'Feminino', value: 'Feminino' }]}
                                onChange={(e: any) => onInputChange(e, 'genero')}
                                placeholder="Selecione o Gênero"
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.genero
                                })}
                            />
                            {submitted && !usuario.genero && <small className="p-invalid">Gênero é Obrigatório!</small>}
                    </div>

                       
                    <div className="field">
                            <label htmlFor="cpf">CPF</label>
                            <InputText
                                id="cpf"
                                value={usuario.cpf}
                                onChange={(e) => onInputChange(e, 'cpf')}
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && ! usuario.cpf
                                })}
                            />
                            {submitted && !usuario.cpf && <small className="p-invalid">CPF é Obrigatório!</small>}
                        </div>


                        <div className="field">
                            <label htmlFor="nome">Senha</label>
                            <InputText
                                id="Senha"
                                value={usuario.senha}
                                onChange={(e) => onInputChange(e, 'senha')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !usuario.senha
                                })}
                            />
                            {submitted && !usuario.senha && <small className="p-invalid">Senha e obrigatorio.</small>}
                        </div>

                        <div className="field">
                            <label className="mb-3">Cargo</label>
                            <div className="formgrid grid">
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="cargo" name="cargo" value="vereador" onChange={onCargoChange} checked={usuario.cargo === 'vereador'} />
                                    <label htmlFor="category1">Vereador</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="cargo2" name="cargo" value="presidente" onChange={onCargoChange} checked={usuario.cargo === 'presidente'} />
                                    <label htmlFor="cargo2">Presidente</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="cargo3" name="cargo" value="comissao" onChange={onCargoChange} checked={usuario.cargo === 'comissao'} />
                                    <label htmlFor="cargo3">Comissao</label>
                                </div>                            
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="cargo4" name="cargo" value="procurador" onChange={onCargoChange} checked={usuario.cargo === 'procurador'} />
                                    <label htmlFor="cargo4">Procurador</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="cargo5" name="cargo" value="prefeito" onChange={onCargoChange} checked={usuario.cargo === 'prefeito'} />
                                    <label htmlFor="cargo5">Prefeito</label>
                                </div>
                                <div className="field-radiobutton col-6">
                                    <RadioButton inputId="cargo6" name="cargo" value="assessor" onChange={onCargoChange} checked={usuario.cargo === 'assessor'} />
                                    <label htmlFor="cargo6">Assessor</label>
                                </div>
                            </div>
                        </div>
                        
                        </Dialog>
                        


                    <Dialog visible={deleteUsuarioDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuarioDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && (
                                <span>
                                    Voce realmente deseja Excluir o usuario <b>{usuario.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUsuariosDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteUsuarioDialogFooter} onHide={hideDeleteUsuariosDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {usuario && <span>Voce realmente deseja Excluir os usuarios selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>

    );
};

export default Crud;