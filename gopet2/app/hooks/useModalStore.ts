import { create } from 'zustand';

export interface ShelterData {
  type: "shelter";
  title: string;
  address: string;
  region: string;
  phone: string;
}

export interface HospitalData {
  type: "hospital";
  title: string;
  address: string;
  phone: string;
  description: string;
  charge: string;
  url: string;
}

export interface ParkData {
  type: "park";
  title: string;
  address: string;
  phone: string;
  description: string;
  charge: string;
  url: string;
}

export interface FoodData {
  type: "food";
  title: string;
  address: string;
  phone: string;
  description: string;
  charge: string;
  url: string;
}

export interface CafeData {
  type: "cafe";
  title: string;
  address: string;
  phone: string;
  description: string;
  charge: string;
  url: string;
}


interface ModalState {
  modalData: ShelterData | HospitalData | ParkData | FoodData | CafeData | null;
  setModalData: (data: ShelterData  | HospitalData | ParkData | FoodData | CafeData | null) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalData: null,
  setModalData: (data) => set({ modalData: data }),
}));
