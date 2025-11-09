import api from "../axios";
import { SITE_URL } from "../constants";

export const getSliders = async () => {
  const res = await fetch(`${SITE_URL}/api/sliders`, {
    // cache: "force-cache",
    // next: { tags: [CacheTags.SLIDER] },
  });
  const data = await res.json();
  return data;
};

export const createSlider = async (id: string) => {
  const { data: res } = await api.post("/sliders", { id });
  return res;
};

export const updateSlider = async ({
  sliderId,
  filmId,
}: {
  sliderId: string;
  filmId: string;
}) => {
  const { data: res } = await api.put(`/sliders/${sliderId}`, { filmId });
  return res;
};

export const deleteSlider = async (id: string) => {
  const { data: res } = await api.delete(`/sliders/${id}`);
  return res;
};
