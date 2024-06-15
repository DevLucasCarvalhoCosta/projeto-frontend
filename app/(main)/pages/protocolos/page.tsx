"use client";

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DropdownChangeEvent } from 'primereact/dropdown';
import { useAuth } from '../../../../service/hook/useAuth';

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
  const { token } = useAuth(); // Obtenha o token de autenticação do hook useAuth

  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
  const [editProtocolo, setEditProtocolo] = useState<Protocolo | null>(null);
  const [newProtocolo, setNewProtocolo] = useState<Protocolo>({
    id: 0,
    numero: '',
    assunto: '',
    conteudo: '',
    statusVotacao: 'pendente',
    pdfPath: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedPdfPath, setSelectedPdfPath] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    if (token) {
      fetchProtocolos(); // Chame a função para buscar os protocolos
    }
  }, [token]);

  const fetchProtocolos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/protocolos', {
        headers: {
          Authorization: `Bearer ${token}` // Adicione o token no cabeçalho da requisição
        }
      });
      setProtocolos(response.data);
    } catch (error) {
      console.error('Erro ao buscar protocolos:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/protocolos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}` // Adicione o token no cabeçalho da requisição
        }
      });
      fetchProtocolos();
    } catch (error) {
      console.error('Erro ao excluir protocolo:', error);
    }
  };

  const handleEdit = (protocolo: Protocolo) => {
    setEditProtocolo(protocolo);
    setShowEditModal(true);
  };

  const handleViewPdf = (pdfPath: string) => {
    setSelectedPdfPath(pdfPath);
    setShowPdfModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setSelectedFile(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditProtocolo(null);
    setSelectedFile(null);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
    setSelectedPdfPath('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSaveNewProtocolo = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('id', newProtocolo.id.toString());
    formData.append('numero', newProtocolo.numero);
    formData.append('assunto', newProtocolo.assunto);
    formData.append('conteudo', newProtocolo.conteudo);
    formData.append('statusVotacao', newProtocolo.statusVotacao);

    if (selectedFile) {
      formData.append('pdf', selectedFile);
    }

    try {
      const response = await axios.post('http://localhost:3000/api/protocolos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` // Adicione o token no cabeçalho da requisição
        }
      });

      if (response.status === 201) {
        fetchProtocolos();
        setShowAddModal(false);
        setNewProtocolo({ id: 0, numero: '', assunto: '', conteudo: '', statusVotacao: 'pendente', pdfPath: '' });
        setSelectedFile(null);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Protocolo Adicionado', life: 3000 });
      } else {
        console.error('Erro ao adicionar protocolo:', response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao adicionar protocolo:', error);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Erro ao adicionar protocolo', life: 3000 });
    }
  };

  const handleSaveEditProtocolo = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    if (editProtocolo) {
      formData.append('numero', editProtocolo.numero.toString());
      formData.append('assunto', editProtocolo.assunto);
      formData.append('conteudo', editProtocolo.conteudo);
      formData.append('statusVotacao', editProtocolo.statusVotacao);

      if (selectedFile) {
        formData.append('pdf', selectedFile);
      }
      try {
        await axios.put(`http://localhost:3000/api/protocolos/${editProtocolo.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}` // Adicione o token no cabeçalho da requisição
          }
        });
        fetchProtocolos();
        setShowEditModal(false);
        setEditProtocolo(null);
        setSelectedFile(null);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Protocolo Atualizado', life: 3000 });
      } catch (error) {
        console.error('Erro ao atualizar protocolo:', error);
        toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Erro ao atualizar protocolo', life: 3000 });
      }
    }
  };

  const handleChangeNew = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewProtocolo((prevProtocolo) => ({
      ...prevProtocolo,
      [name]: value,
    }));
  };

  const handleChangeNew2 = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setNewProtocolo((prevProtocolo) => ({
      ...prevProtocolo,
      [name]: value,
    }));
  };

  const handleChangeNew3 = (event: DropdownChangeEvent) => {
    setNewProtocolo((prevProtocolo) => ({
      ...prevProtocolo,
      statusVotacao: event.value,
    }));
  };

  const handleChangeEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditProtocolo((prevProtocolo) => ({
      ...prevProtocolo,
      [name]: value,
    } as Protocolo));
  };

  const handleChangeEdit2 = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEditProtocolo((prevProtocolo) => ({
      ...prevProtocolo,
      [name]: value,
    } as Protocolo));
  };

  const handleChangeEdit3 = (event: DropdownChangeEvent) => {
    setEditProtocolo((prevProtocolo) => ({
      ...prevProtocolo,
      statusVotacao: event.value,
    } as Protocolo));
  };

  const statusVotacaoOptions = [
    { label: 'Pendente', value: 'pendente' },
    { label: 'Aprovado', value: 'aprovado' },
    { label: 'Reprovado', value: 'reprovado' }
  ];

  const actionBodyTemplate = (rowData: Protocolo) => {
    return (
      <div className="actions">
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => handleEdit(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger mr-2" onClick={() => handleDelete(rowData.id)} />
        <Button icon="pi pi-file-pdf" className="p-button-rounded p-button-info" onClick={() => handleViewPdf(rowData.pdfPath)} />
      </div>
    );
  };

  const getNextProtocoloNumber = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/protocolos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const lastProtocolo = response.data[response.data.length - 1];
      const nextNumber = lastProtocolo ? parseInt(lastProtocolo.numero) + 1 : 1;
      setNewProtocolo((prevProtocolo) => ({
        ...prevProtocolo,
        numero: nextNumber.toString(),
      }));
    } catch (error) {
      console.error('Erro ao buscar o próximo número do protocolo:', error);
    }
  };

  useEffect(() => {
    if (showAddModal) {
      getNextProtocoloNumber();
    }
  }, [showAddModal]);

  return (
    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">
        <h1>Protocolos</h1>
        <Button label="Adicionar Novo Protocolo" icon="pi pi-plus" onClick={() => setShowAddModal(true)} />

        <DataTable value={protocolos} dataKey="id" paginator rows={10} className="datatable-responsive">
          <Column field="numero" header="Número" sortable />
          <Column field="assunto" header="Assunto" sortable />
          <Column field="conteudo" header="Conteúdo" sortable />
          <Column field="dataCriacao" header="Data de Criação" sortable />
          <Column field="statusVotacao" header="Status de Votação" sortable />
          <Column body={actionBodyTemplate} header="Ações" />
        </DataTable>

        <Dialog visible={showAddModal} style={{ width: '450px' }} header="Adicionar Protocolo" modal className="p-fluid" onHide={handleCloseAddModal}>
          <form onSubmit={handleSaveNewProtocolo}>
            <div className="field">
              <label htmlFor="numero">Número</label>
              <InputText id="numero" name="numero" value={newProtocolo.numero} readOnly />
            </div>
            <div className="field">
              <label htmlFor="assunto">Assunto</label>
              <InputText id="assunto" name="assunto" value={newProtocolo.assunto} onChange={handleChangeNew} required />
            </div>
            <div className="field">
              <label htmlFor="conteudo">Conteúdo</label>
              <InputTextarea id="conteudo" name="conteudo" value={newProtocolo.conteudo} onChange={handleChangeNew2} required rows={3} />
            </div>
            <div className="field">
              <label htmlFor="statusVotacao">Status de Votação</label>
              <Dropdown id="statusVotacao" name="statusVotacao" value={newProtocolo.statusVotacao} options={statusVotacaoOptions} onChange={handleChangeNew3} />
            </div>
            <div className="field">
              <label htmlFor="pdfPath">Caminho do PDF</label>
              <FileUpload name="pdfPath" accept="application/pdf" maxFileSize={1000000} onSelect={(e) => setSelectedFile(e.files[0])} />
            </div>
            <Button type="submit" label="Salvar" icon="pi pi-check" />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={handleCloseAddModal} />
          </form>
        </Dialog>

        <Dialog visible={showEditModal} style={{ width: '450px' }} header="Editar Protocolo" modal className="p-fluid" onHide={handleCloseEditModal}>
          <form onSubmit={handleSaveEditProtocolo}>
            <div className="field">
              <label htmlFor="numero">Número</label>
              <InputText id="numero" name="numero" value={editProtocolo?.numero || ''} readOnly />
            </div>
            <div className="field">
              <label htmlFor="assunto">Assunto</label>
              <InputText id="assunto" name="assunto" value={editProtocolo?.assunto || ''} onChange={handleChangeEdit} required />
            </div>
            <div className="field">
              <label htmlFor="conteudo">Conteúdo</label>
              <InputTextarea id="conteudo" name="conteudo" value={editProtocolo?.conteudo || ''} onChange={handleChangeEdit2} required rows={3} />
            </div>
            <div className="field">
              <label htmlFor="statusVotacao">Status de Votação</label>
              <Dropdown id="statusVotacao" name="statusVotacao" value={editProtocolo?.statusVotacao || ''} options={statusVotacaoOptions} onChange={handleChangeEdit3} />
            </div>
            <div className="field">
              <label htmlFor="pdfPath">Caminho do PDF</label>
              <FileUpload name="pdfPath" accept="application/pdf" maxFileSize={1000000} onSelect={(e) => setSelectedFile(e.files[0])} />
            </div>
            <Button type="submit" label="Salvar" icon="pi pi-check" />
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={handleCloseEditModal} />
          </form>
        </Dialog>

        <Dialog visible={showPdfModal} style={{ width: '450px' }} header="Visualizar PDF" modal className="p-fluid" onHide={handleClosePdfModal}>
          <embed src={`http://localhost:3000/uploads/${selectedPdfPath}`} type="application/pdf" width="100%" height="600px" />
          <Button label="Fechar" icon="pi pi-times" onClick={handleClosePdfModal} />
        </Dialog>
      </div>
    </div>
  );
};

export default ProtocolosPage;
