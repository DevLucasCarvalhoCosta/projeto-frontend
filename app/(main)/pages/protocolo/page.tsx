"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  const handleDelete = async (id: number) => {
    try {
      await axios.delete('http://localhost:3000/api/protocolos/' + id);
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
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        fetchProtocolos();
        setShowAddModal(false);
        setNewProtocolo({ id: 0, numero: '', assunto: '', conteudo: '', statusVotacao: 'pendente', pdfPath: '' });
        setSelectedFile(null);
      } else {
        console.error('Erro ao adicionar protocolo:', response.data.erro);
      }
    } catch (error) {
      console.error('Erro ao adicionar protocolo:', error);
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
            'Content-Type': 'multipart/form-data'
          }
        });
        fetchProtocolos();
        setShowEditModal(false);
        setEditProtocolo(null);
        setSelectedFile(null);
      } catch (error) {
        console.error('Erro ao atualizar protocolo:', error);
      }
    }
  };

  const handleChangeNew = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNewProtocolo((prevProtocolo) => ({
      ...prevProtocolo,
      [name]: value,
    }));
  };

  const handleChangeEdit = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setEditProtocolo((prevProtocolo) => ({
      ...prevProtocolo,
      [name]: value,
    } as Protocolo));
  };

  return (
    <div>
      <h1>Protocolos</h1>
      <button onClick={() => setShowAddModal(true)}>Adicionar Novo Protocolo</button>
      <ul>
        {protocolos.map((protocolo) => (
          <li key={protocolo.id}>
            <p>Número: {protocolo.numero}</p>
            <p>Assunto: {protocolo.assunto}</p>
            <p>Conteúdo: {protocolo.conteudo}</p>
            <p>Data de Criação: {protocolo.dataCriacao}</p>
            <p>Status de Votação: {protocolo.statusVotacao}</p>
            <a href="#" onClick={() => handleViewPdf(protocolo.pdfPath)}>Ver PDF</a>
            <button onClick={() => handleEdit(protocolo)}>Editar</button>
            <button onClick={() => handleDelete(protocolo.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      {showAddModal && (
        <div className="modal">
          <h2>Adicionar Protocolo</h2>
          <form onSubmit={handleSaveNewProtocolo}>
            <label>
              Número:
              <input type="number" name="numero" value={newProtocolo.numero} onChange={handleChangeNew} />
            </label>
            <label>
              Assunto:
              <input type="text" name="assunto" value={newProtocolo.assunto} onChange={handleChangeNew} />
            </label>
            <label>
              Conteúdo:
              <input type="text" name="conteudo" value={newProtocolo.conteudo} onChange={handleChangeNew} />
            </label>
            <label>
              Status de Votação:
              <select name="statusVotacao" value={newProtocolo.statusVotacao} onChange={handleChangeNew}>
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="reprovado">Reprovado</option>
                <option value="naoVotado">Não Votado</option>
              </select>
            </label>
            <label>
              Caminho do PDF:
              <input type="file" name="pdfPath" onChange={handleFileChange} />
            </label>
            <button type="submit">Salvar</button>
            <button type="button" onClick={handleCloseAddModal}>Cancelar</button>
          </form>
        </div>
      )}

      {showEditModal && (
        <div className="modal">
          <h2>Editar Protocolo</h2>
          <form onSubmit={handleSaveEditProtocolo}>
            <label>
              Número:
              <input type="number" name="numero" value={editProtocolo?.numero || ''} onChange={handleChangeEdit} />
            </label>
            <label>
              Assunto:
              <input type="text" name="assunto" value={editProtocolo?.assunto || ''} onChange={handleChangeEdit} />
            </label>
            <label>
              Conteúdo:
              <input type="text" name="conteudo" value={editProtocolo?.conteudo || ''} onChange={handleChangeEdit} />
            </label>
            <label>
              Status de Votação:
              <select name="statusVotacao" value={editProtocolo?.statusVotacao || 'pendente'} onChange={handleChangeEdit}>
                <option value="pendente">Pendente</option>
                <option value="aprovado">Aprovado</option>
                <option value="reprovado">Reprovado</option>
                <option value="naoVotado">Não Votado</option>
              </select>
            </label>
            <label>
              Caminho do PDF:
              <input type="file" name="pdfPath" onChange={handleFileChange} />
            </label>
            <button type="submit">Salvar</button>
            <button type="button" onClick={handleCloseEditModal}>Cancelar</button>
          </form>
        </div>
      )}

      {showPdfModal && (
        <div className="modal">
          <button onClick={handleClosePdfModal}>Fechar</button>
          <embed src={`http://localhost:3000/uploads/${selectedPdfPath}`} type="application/pdf" width="100%" height="600px" />
        </div>
      )}
    </div>
  );
};

export default ProtocolosPage;
