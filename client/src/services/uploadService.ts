import api from '../api/axios';
import { API_ENDPOINTS } from '../constants/api';

export interface UploadResult {
  url: string;
  filename: string;
}

export const uploadService = {
  async uploadImage(file: File, folder = 'products'): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post(API_ENDPOINTS.uploads, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data.data as UploadResult;
  },

  async uploadImages(files: File[], folder = 'products'): Promise<UploadResult[]> {
    return Promise.all(files.map((file) => this.uploadImage(file, folder)));
  },
};
