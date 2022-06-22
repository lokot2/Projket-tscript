import { INote } from "./interface";

export const DATA_KEY = "notes_data";

export class AppStorage {
  constructor() {}

  // Save data to local storage and avoid refresh if there is data.
  saveData(data: INote) {
    const currentData = this.getData();
    const indexInLS = currentData.findIndex((val) => val.id === data.id);
    if (indexInLS !== -1) {
      currentData[indexInLS] = data;
      localStorage.setItem(DATA_KEY, JSON.stringify(currentData));
      return;
    }

    localStorage.setItem(DATA_KEY, JSON.stringify([...currentData, data]));
  }

  getData(): INote[] {
    const data = localStorage.getItem(DATA_KEY);
    if (data) return JSON.parse(data);
    return [];
  }
}
