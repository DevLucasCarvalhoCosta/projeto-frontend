'use client';
import React, { useEffect, useState, useRef, ChangeEvent } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import axios from 'axios';
import { classNames } from 'primereact/utils';

interface Protocolo {
  id: number;
  numero: string;
  assunto: string;
  conteudo: string;
  dataCriacao?: string;
  statusVotacao: string;
  pdfPath: string;
}

const ProtocolosPage: React.FC = () => {
  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
  const [protocoloDialog, setProtocoloDialog] = useState(false);
  const [deleteProtocoloDialog, setDeleteProtocoloDialog] = useState(false);
  const [protocolo, setProtocolo] = useState<Protocolo>({ id: 0, numero: '', assunto: '', conteudo: '', statusVotacao: 'pendente', pdfPath: '' });
  const [selectedProtocolos, setSelectedProtocolos] = useState<Protocolo[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<any>>(null);

  useEffect(() => {
    fetchProtocolos();
  }, []);

  const fetchProtocolos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/protocolos');
      setProtocolos(response.data);
    } catch (error) {
      console.error('Erro ao buscar protocolos:', error);
    }
  };

  const openNew = () => {
    setProtocolo({ id: 0, numero: '', assunto: '', conteudo: '', statusVotacao: 'pendente', pdfPath: '' });
    setSubmitted(false);
    setProtocoloDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProtocoloDialog(false);
  };

  const hideDeleteProtocoloDialog = () => {
    setDeleteProtocoloDialog(false);
  };

  const saveProtocolo = async () => {
    setSubmitted(true);

    if (protocolo.numero.trim()) {
      let _protocolos = [...protocolos];
      let _protocolo = { ...protocolo };

      if (protocolo.id) {
        const index = findIndexById(protocolo.id);
        _protocolos[index] = _protocolo;

        try {
          await axios.put(`http://localhost:3000/api/protocolos/${_protocolo.id}`, _protocolo);
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Protocolo Updated', life: 3000 });
        } catch (error) {
          console.error('Erro ao atualizar protocolo:', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Erro ao atualizar protocolo', life: 3000 });
        }
      } else {
        _protocolo.id = createId();
        _protocolos.push(_protocolo);

        try {
          await axios.post('http://localhost:3000/api/protocolos', _protocolo);
          toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Protocolo Created', life: 3000 });
        } catch (error) {
          console.error('Erro ao adicionar protocolo:', error);
          toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Erro ao adicionar protocolo', life: 3000 });
        }
      }

      setProtocolos(_protocolos);
      setProtocoloDialog(false);
      setProtocolo({ id: 0, numero: '', assunto: '', conteudo: '', statusVotacao: 'pendente', pdfPath: '' });
    }
  };

  const editProtocolo = (protocolo: Protocolo) => {
    setProtocolo({ ...protocolo });
    setProtocoloDialog(true);
  };

  const confirmDeleteProtocolo = (protocolo: Protocolo) => {
    setProtocolo(protocolo);
    setDeleteProtocoloDialog(true);
  };

  const deleteProtocolo = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/protocolos/${protocolo.id}`);
      const _protocolos = protocolos.filter((val) => val.id !== protocolo.id);
      setProtocolos(_protocolos);
      setDeleteProtocoloDialog(false);
      setProtocolo({ id: 0, numero: '', assunto: '', conteudo: '', statusVotacao: 'pendente', pdfPath: '' });
      toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Protocolo Deleted', life: 3000 });
    } catch (error) {
      console.error('Erro ao excluir protocolo:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Erro ao excluir protocolo', life: 3000 });
    }
  };

  const findIndexById = (id: number) => {
    let index = -1;
    for (let i = 0; i < protocolos.length; i++) {
      if (protocolos[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const createId = () => {
    return Math.floor(Math.random() * 10000);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
    const val = (e.target && e.target.value) || '';
    let _protocolo = { ...protocolo };
    (_protocolo as any)[name] = val;

    setProtocolo(_protocolo);
  };

  const onStatusChange = (e: DropdownChangeEvent) => {
    const val = e.value;
    let _protocolo = { ...protocolo };
    _protocolo.statusVotacao = val;

    setProtocolo(_protocolo);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="Novo" icon="pi pi-plus" className="mr-2" onClick={openNew} />
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload mode="basic" accept="application/pdf" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
        <Button label="Export" icon="pi pi-upload" onClick={() => dt.current?.exportCSV()} />
      </React.Fragment>
    );
  };

  const numeroBodyTemplate = (rowData: Protocolo) => {
    return (
      <>
        <span className="p-column-title">Número</span>
        {rowData.numero}
      </>
    );
  };

  const assuntoBodyTemplate = (rowData: Protocolo) => {
    return (
      <>
        <span className="p-column-title">Assunto</span>
        {rowData.assunto}
      </>
    );
  };

  const conteudoBodyTemplate = (rowData: Protocolo) => {
    return (
      <>
        <span className="p-column-title">Conteúdo</span>
        {rowData.conteudo}
      </>
    );
  };

  const statusVotacaoBodyTemplate = (rowData: Protocolo) => {
    return (
      <>
        <span className="p-column-title">Status de Votação</span>
        {rowData.statusVotacao}
      </>
    );
  };

  const actionBodyTemplate = (rowData: Protocolo) => {
    return (
      <>
        <Button icon="pi pi-eye" className="mr-2" onClick={() => viewPDF(rowData.pdfPath)} disabled={!rowData.pdfPath} />
        <Button icon="pi pi-pencil" className="mr-2" onClick={() => editProtocolo(rowData)} />
        <Button icon="pi pi-trash" className="mr-2" onClick={() => confirmDeleteProtocolo(rowData)} />
      </>
    );
  };

  const viewPDF = (pdfPath: string) => {
    window.open(`http://localhost:3000/${pdfPath}`, '_blank');
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Gerenciar Protocolos</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Buscar..." />
      </span>
    </div>
  );

  const protocoloDialogFooter = (
    <>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Salvar" icon="pi pi-check" className="p-button-text" onClick={saveProtocolo} />
    </>
  );

  const deleteProtocoloDialogFooter = (
    <>
      <Button label="Não" icon="pi pi-times" onClick={hideDeleteProtocoloDialog} />
      <Button label="Sim" icon="pi pi-check" onClick={deleteProtocolo} />
    </>
  );

  return (
    <div className="datatable-crud-demo">
      <Toast ref={toast} />

      <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

      <DataTable
        ref={dt}
        value={protocolos}
        selection={selectedProtocolos}
        onSelectionChange={(e) => setSelectedProtocolos(e.value)}
        dataKey="id"
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        globalFilter={globalFilter}
        header={header}
        responsiveLayout="scroll"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="numero" header="Número" sortable body={numeroBodyTemplate}></Column>
        <Column field="assunto" header="Assunto" sortable body={assuntoBodyTemplate}></Column>
        <Column field="conteudo" header="Conteúdo" body={conteudoBodyTemplate}></Column>
        <Column field="statusVotacao" header="Status de Votação" sortable body={statusVotacaoBodyTemplate}></Column>
        <Column body={actionBodyTemplate}></Column>
      </DataTable>

      <Dialog visible={protocoloDialog} style={{ width: '450px' }} header="Detalhes do Protocolo" modal className="p-fluid" footer={protocoloDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="numero">Número</label>
          <InputText id="numero" value={protocolo.numero} onChange={(e) => onInputChange(e, 'numero')} required autoFocus className={classNames({ 'p-invalid': submitted && !protocolo.numero })} />
          {submitted && !protocolo.numero && <small className="p-error">Número é obrigatório.</small>}
        </div>

        <div className="field">
          <label htmlFor="assunto">Assunto</label>
          <InputTextarea id="assunto" value={protocolo.assunto} onChange={(e) => onInputChange(e, 'assunto')} required rows={3} cols={20} />
          {submitted && !protocolo.assunto && <small className="p-error">Assunto é obrigatório.</small>}
        </div>

        <div className="field">
          <label htmlFor="conteudo">Conteúdo</label>
          <InputTextarea id="conteudo" value={protocolo.conteudo} onChange={(e) => onInputChange(e, 'conteudo')} required rows={3} cols={20} />
          {submitted && !protocolo.conteudo && <small className="p-error">Conteúdo é obrigatório.</small>}
        </div>

        <div className="field">
          <label htmlFor="statusVotacao">Status de Votação</label>
          <Dropdown id="statusVotacao" value={protocolo.statusVotacao} options={[{ label: 'Pendente', value: 'pendente' }, { label: 'Aprovado', value: 'aprovado' }, { label: 'Rejeitado', value: 'rejeitado' }]} onChange={onStatusChange} placeholder="Selecione um status" />
        </div>

        <div className="field">
          <label htmlFor="pdf">Arquivo PDF</label>
          <FileUpload mode="basic" accept="application/pdf" maxFileSize={1000000} onUpload={(e) => setProtocolo({ ...protocolo, pdfPath: e.files[0].name })} />
        </div>
      </Dialog>

      <Dialog visible={deleteProtocoloDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProtocoloDialogFooter} onHide={hideDeleteProtocoloDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {protocolo && (
            <span>
              Tem certeza que deseja deletar o protocolo <b>{protocolo.numero}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default ProtocolosPage;
