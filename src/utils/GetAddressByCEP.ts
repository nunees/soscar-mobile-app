import axios from 'axios';

import { AppError } from './AppError';

export async function GetAddressByCEP(cep: string) {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (!response) {
      throw new AppError('CEP não encontrado, tente novamente.');
    }
    return response;
  } catch (err) {
    throw new AppError('CEP não encontrado, tente novamente.');
  }
}
