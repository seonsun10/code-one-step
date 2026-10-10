import { createProgressStorage } from './progress-storage.js';

const DATABASE_NAME = 'study-web-progress';
const DATABASE_VERSION = 1;
const STORE_NAME = 'progress';
const RECORD_KEY = 'main';
const FALLBACK_KEY = 'study-web-progress-v1';
const MAX_LOCAL_BYTES = 900_000;
let databasePromise;

function openDatabase() {
  if (databasePromise) return databasePromise;
  databasePromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('이 브라우저에서 IndexedDB를 사용할 수 없습니다.'));
      return;
    }
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('기기 저장 공간을 열지 못했습니다.'));
    request.onblocked = () => reject(new Error('다른 탭에서 저장 공간을 사용 중입니다.'));
  }).catch((error) => {
    databasePromise = undefined;
    throw error;
  });
  return databasePromise;
}

function readRecord(database) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).get(RECORD_KEY);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error ?? new Error('저장된 학습 기록을 읽지 못했습니다.'));
  });
}

function writeRecord(database, progress) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(progress, RECORD_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('학습 기록을 저장하지 못했습니다.'));
    transaction.onabort = () => reject(transaction.error ?? new Error('학습 기록 저장이 취소되었습니다.'));
  });
}

function readFallback() {
  try {
    const value = localStorage.getItem(FALLBACK_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function writeFallback(progress) {
  const serialized = JSON.stringify(progress);
  if (new TextEncoder().encode(serialized).byteLength > MAX_LOCAL_BYTES) {
    throw new RangeError('브라우저 보조 저장 공간이 가득 찼습니다. 기록을 내보낸 뒤 오래된 답안을 정리해 주세요.');
  }
  localStorage.setItem(FALLBACK_KEY, serialized);
}

const storage = createProgressStorage({
  readPrimary: async () => readRecord(await openDatabase()),
  writePrimary: async (progress) => writeRecord(await openDatabase(), progress),
  readFallback,
  writeFallback,
  clearFallback: () => localStorage.removeItem(FALLBACK_KEY),
});

export const getStorageMode = storage.getStorageMode;
export const loadProgress = storage.loadProgress;
export const saveProgress = storage.saveProgress;

export async function replaceProgress(value) {
  return saveProgress(value);
}
