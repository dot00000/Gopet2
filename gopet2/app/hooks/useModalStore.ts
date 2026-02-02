import { create } from 'zustand';

export interface ShelterData {
  type: "shelter";
  title: string;
  address: string;
  region: string;
  phone: string;
}

interface ModalState {
  modalData: ShelterData | null;
  setModalData: (data: ShelterData | null) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalData: null,
  setModalData: (data) => set({ modalData: data }),
}));
