import { openDB } from "idb";

const DB_NAME = "bd-rythm-audio";
const STORE = "tracks";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    },
  });
}

export async function saveTrack(id: string, blob: Blob) {
  const db = await getDB();
  await db.put(STORE, blob, id);
}

export async function getTrack(id: string) {
  const db = await getDB();
  return db.get(STORE, id);
}