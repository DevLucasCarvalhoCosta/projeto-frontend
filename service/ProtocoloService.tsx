import axios from 'axios';

const API_URL = 'http://localhost:3000/api/protocolos';

export const ProtocoloService = {
  fetchProtocolos: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar protocolos:', error);
      throw error;
    }
  },

  deleteProtocolo: async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error('Erro ao excluir protocolo:', error);
      throw error;
    }
  },

  addProtocolo: async (protocoloData: FormData) => {
    try {
      const response = await axios.post(API_URL, protocoloData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar protocolo:', error);
      throw error;
    }
  },

  updateProtocolo: async (id: number, protocoloData: FormData) => {
    try {
      await axios.put(`${API_URL}/${id}`, protocoloData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      console.error('Erro ao atualizar protocolo:', error);
      throw error;
    }
  }
};
