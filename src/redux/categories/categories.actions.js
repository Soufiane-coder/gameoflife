import { CategoriesActionTypes } from "./categories.types";

export const setCurrentCategories = (categories) => ({
  type: CategoriesActionTypes.SET_CURRENT_CATEGORIES,
  payload: categories,
});
