import { INote } from "./interface";
import { db } from "./config";

const noteCollection = db.collection("notes");

export class AppFirestoreStorage {
  constructor() {}

  // Data refresh rate and return a new city weather data
  createNote = async (note: INote): Promise<INote> => {
    const newDoc = await noteCollection.add(note);
    return {
      id: newDoc.id,
      ...note,
    };
  };
}
