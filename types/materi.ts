// types/materi.ts

// Base response type
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
  }
  
  // Materi types
  export interface Materi {
    id: string;
    judul: string;
    tujuanPembelajaran: string[];
    capaianPembelajaran: string[];
    deskripsi: string;
    thumbnailUrl: string;
    urutan: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MateriListResponse {
    materi: Materi[];
    total: number;
    page: number;
    limit: number;
  }
  
  export interface SubMateri {
    id: string;
    judul: string;
    konten: string;
    imageUrls: string[];
    urutan: number;
    status: boolean;
  }
  
  export interface VideoMateri {
    id: string;
    judul: string;
    deskripsi: string;
    videoUrl: string;  
    youtubeId: string; 
    thumbnailUrl: string;
    durasi: number;
    urutan: number;
    status: boolean;
  }
  
  export interface MateriDetail extends Materi {
    subMateri: SubMateri[];
    videoMateri: VideoMateri[];
  }
  
  // Request params types
  export interface MateriListParams {
    search?: string;
    page?: number;
    limit?: number;
  }