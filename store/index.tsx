import { create } from "zustand";

type State = {
  fileUrl: string | null;
  page: "upload" | "interview" | "result";
  isTts: {
    id?: string
    convert?: boolean
  }
}

type Actions = {
  setFileUrl: (fileUrl: string | null) => void;
  setPage: (page: "upload" | "interview" | "result") => void;
  setIsTts: (isTts: { id: string; convert: boolean }) => void
}

export const useInterviewStore = create<State & Actions>((set) => ({
  fileUrl: null,
  setFileUrl: (fileUrl: string | null) => set(() => ({ fileUrl })),
  page: "upload",
  setPage: (page: "upload" | "interview" | "result") => set(() => ({ page })),
  isTts: {},
  setIsTts: (isTts: { id: string; convert: boolean }) => set(() => ({isTts}))
}));
