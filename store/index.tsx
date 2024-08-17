import { create } from "zustand";

type State = {
  fileUrl: string | null;
  page: "upload" | "interview" | "result";
}

type Actions = {
  setFileUrl: (fileUrl: string | null) => void;
  setPage: (page: "upload" | "interview" | "result") => void;
}

export const useInterviewStore = create<State & Actions>((set) => ({
  fileUrl: null,
  setFileUrl: (fileUrl: string | null) => set(() => ({ fileUrl })),
  page: "upload",
  setPage: (page: "upload" | "interview" | "result") => set(() => ({ page })),
}));
