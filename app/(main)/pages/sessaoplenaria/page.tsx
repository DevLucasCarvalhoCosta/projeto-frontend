/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { MultiSelect } from 'primereact/multiselect'; // Importação do MultiSelect
import React, { useEffect, useRef, useState } from 'react';
import { sessaoPlenariaService } from '@/service/sessaoPlenariaService';
import { Projeto } from '@/types';

const CrudSessaoPlenaria = () => {
    let sessaoPlenariaVazio: Projeto.SessaoPlenaria = {
        id: 0,
        data: null,
        status: 'agendada',
        protocolos: []
    };
s
    const [sessoesPlenarias, setSessoesPlenarias] = useState<Projeto.SessaoPlenaria[] | null>(null);
    const [protocolos, setProtocolos] = useState<Projeto.Protocolo[]>([]); // Estado para os protocolos
    const [sessaoPlenariaDialog, setSessaoPlenariaDialog] = useState(false);
    const [deleteSessaoPlenariaDialog, setDeleteSessaoPlenariaDialog] = useState(false);
    const [sessaoPlenaria, setSessaoPlenaria] = useState<Projeto.SessaoPlenaria>(sessaoPlenariaVazio);
    const [selectedSessoesPlenarias, setSelectedSessoesPlenarias] = useState<Projeto.SessaoPlenaria[] | null>(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        sessaoPlenariaService.listarTodos()
            .then((response) => {
                setSessoesPlenarias(response.data);
            }).catch((error) => {
                console.log(error);
            });
        
        sessaoPlenariaService.listarProtocolos()  // Carregar protocolos disponíveis
            .then((response) => {
                setProtocolos(response.data);
            }).catch((error) => {
                console.log(error);
            });
    }, []);

    const openNew = () => {
        setSessaoPlenaria(sessaoPlenariaVazio);
        setSubmitted(false);
        setSessaoPlenariaDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSessaoPlenariaDialog(false);
    };

    const hideDeleteSessaoPlenariaDialog = () => {
        setDeleteSessaoPlenariaDialog(false);
    };

    const saveSessaoPlenaria = () => {
        setSubmitted(true);

        if (!sessaoPlenaria.id) {
            sessaoPlenariaService.inserir(sessaoPlenaria)
                .then((response) => {
                    setSessaoPlenariaDialog(false);
                    setSessaoPlenaria(sessaoPlenariaVazio);
                    toast.current?.show({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Sessão Plenária criada com sucesso',
                    });
                    window.location.reload();
                }).catch((error) => {
                    console.log(error);
                    toast.current?.show({
                        severity: 'error',
                        summary: 'Erro!',
                        detail: 'Erro ao salvar: ' + error.message
                    });
                });
        } else {
            sessaoPlenariaService.alterar(sessaoPlenaria)
            .then((response) => {
                setSessaoPlenariaDialog(false);
                setSessaoPlenaria(sessaoPlenariaVazio);
                setSessoesPlenarias(null);
                toast.current?.show({
                    severity: 'info',
                    summary: 'Sucesso!',
                    detail: 'Sessão Plenária alterada com sucesso!'
                });
            }).catch((error) => {
                console.log(error.data.message);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao alterar!' + error.data.message
                });
            })
        }
    }

    const editSessaoPlenaria = (sessaoPlenaria: Projeto.SessaoPlenaria) => {
        setSessaoPlenaria({ ...sessaoPlenaria });
        setSessaoPlenariaDialog(true);
    };

    const confirmDeleteSessaoPlenaria = (sessaoPlenaria: Projeto.SessaoPlenaria) => {
        setSessaoPlenaria(sessaoPlenaria);
        setDeleteSessaoPlenariaDialog(true);
    };

    const deleteSessaoPlenaria = () => {
        if (sessaoPlenaria.id) {
            sessaoPlenariaService.excluir(sessaoPlenaria.id).then((response) => {
                setSessaoPlenaria(sessaoPlenariaVazio);
                setDeleteSessaoPlenariaDialog(false);
                setSessoesPlenarias(null);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Sucesso!',
                    detail: 'Sessão Plenária deletada com sucesso!',
                    life: 3000
                });
                window.location.reload();
            }).catch((error) => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro!',
                    detail: 'Erro ao deletar a sessão plenária!',
                    life: 3000
                });
            });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = e.target.value || '';
        let _sessaoPlenaria = { ...sessaoPlenaria };
        (_sessaoPlenaria as any)[name] = val;
        setSessaoPlenaria(_sessaoPlenaria);
    };

    const onDateChange = (e: any, name: string) => {
        const val = e.value || '';
        let _sessaoPlenaria = { ...sessaoPlenaria };
        (_sessaoPlenaria as any)[name] = val;
        setSessaoPlenaria(_sessaoPlenaria);
    };

    const onProtocolosChange = (e: any) => {
        const selectedProtocolos = e.value || [];
        let _sessaoPlenaria = { ...sessaoPlenaria };
        _sessaoPlenaria.protocolos = selectedProtocolos;
        setSessaoPlenaria(_sessaoPlenaria);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
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

    const idBodyTemplate = (rowData: Projeto.SessaoPlenaria) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };

    const dataBodyTemplate = (rowData: Projeto.SessaoPlenaria) => {
        return (
            <>
                <span className="p-column-title">Data</span>
                {rowData.data ? new Date(rowData.data).toLocaleDateString() : 'Data não disponível'}
            </>
        );
    };
    

    const statusBodyTemplate = (rowData: Projeto.SessaoPlenaria) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                {rowData.status}
            </>
        );
    };

    const actionBodyTemplate = (rowData: Projeto.SessaoPlenaria) => {
        return (
            <div className="actions">
                {/* <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editSessaoPlenaria(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded className="mr-2" onClick={() => confirmDeleteSessaoPlenaria(rowData)} /> */}
            </div>
        );
    };

    const header = (
        <div className="table-header">
            <h5 className="mx-0 my-1">Gerenciar Sessões Plenárias</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const sessaoPlenariaDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveSessaoPlenaria} />
        </>
    );

    const deleteSessaoPlenariaDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteSessaoPlenariaDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSessaoPlenaria} />
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
                        value={sessoesPlenarias}
                        selection={selectedSessoesPlenarias}
                        onSelectionChange={(e) => setSelectedSessoesPlenarias(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} de {last} de {totalRecords} sessões plenárias"
                        globalFilter={globalFilter}
                        header={header}
                    >
                        <Column field="id" header="ID" body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="data" header="Data" body={dataBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={sessaoPlenariaDialog} style={{ width: '450px' }} header="Sessão Plenária" modal className="p-fluid" footer={sessaoPlenariaDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="data">Data</label>
                            <Calendar id="data" value={sessaoPlenaria.data} onChange={(e) => onDateChange(e, 'data')} required className={classNames({ 'p-invalid': submitted && !sessaoPlenaria.data })}></Calendar>
                            {submitted && !sessaoPlenaria.data && <small className="p-invalid">Data é obrigatória.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="status">Status</label>
                            <InputText id="status" value={sessaoPlenaria.status} onChange={(e) => onInputChange(e, 'status')} required className={classNames({ 'p-invalid': submitted && !sessaoPlenaria.status })}></InputText>
                            {submitted && !sessaoPlenaria.status && <small className="p-invalid">Status é obrigatório.</small>}
                        </div>

                        <div className="field">
                            <label htmlFor="protocolos">Protocolos</label>
                            <MultiSelect 
                                id="protocolos" 
                                value={sessaoPlenaria.protocolos} 
                                options={protocolos} 
                                onChange={onProtocolosChange} 
                                optionLabel="assunto"
                                display="chip"
                                placeholder="Selecione os Protocolos"
                                required 
                                className={classNames({ 'p-invalid': submitted && !sessaoPlenaria.protocolos.length })} 
                            />
                            {submitted && !sessaoPlenaria.protocolos.length && <small className="p-invalid">Pelo menos um protocolo é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteSessaoPlenariaDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteSessaoPlenariaDialogFooter} onHide={hideDeleteSessaoPlenariaDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {sessaoPlenaria && sessaoPlenaria.data && (<span>Tem certeza que deseja deletar a sessão plenária de {new Date(sessaoPlenaria.data).toLocaleDateString()}?</span>
)}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}

export default CrudSessaoPlenaria;
