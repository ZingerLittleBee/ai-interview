import { create } from "zustand";

export const useInterviewStore = create((set) => ({
  fileUrl: null,
  setFileUrl: (fileUrl: string | null) => set(() => ({ fileUrl })),
  page: "upload",
  setPage: (page: "upload" | "interview" | "result") => set(() => ({ page })),
}));
