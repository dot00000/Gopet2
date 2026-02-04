import { create } from 'zustand';

export interface ShelterData {
  type: "shelter";
  title: string;
  address: string;
  region: string;
  phone: string;
}

// export interface HotelData {
//   address: string;
//   image : string;
//   title: string;
//   zipcode: string;
//   thumbnail: string;
// }

export interface HospitalData {
  type: "hospital";
  title: string;
  address: string;
  phone: string;
  description: string;
  charge: string;
  url: string;
}

// export interface ParkData {
//   type: "park";
//   title: string;
//   address: string;
//   phone: string;
//   description: string;
//   charge: string;
//   url: string;
// }

interface ModalState {
  modalData: ShelterData | HospitalData | null;
  setModalData: (data: ShelterData  | HospitalData | null) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modalData: null,
  setModalData: (data) => set({ modalData: data }),
}));
