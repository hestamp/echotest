import { useContext } from 'react';
import { StorageContext } from './StorageContext';

export function useMyGlobal() {
  const { global } = useContext(StorageContext);
  if (!global) {
    throw new Error('No Global Context');
  }
  return global;
}
export function useMyNotification() {
  const { notification } = useContext(StorageContext);
  if (!notification) {
    throw new Error('No Global Context');
  }
  return notification;
}

export function useMyMainContext() {
  const { mainpage } = useContext(StorageContext);
  if (!mainpage) {
    throw new Error('No Main C');
  }
  return mainpage;
}
export function useMyLogic() {
  const { logic } = useContext(StorageContext);
  if (!logic) {
    throw new Error('No Logic Context');
  }
  return logic;
}
export function useMyAchive() {
  const { achivements } = useContext(StorageContext);
  if (!achivements) {
    throw new Error('No Logic Context');
  }
  return achivements;
}

export function useMyGuide() {
  const { guide } = useContext(StorageContext);
  if (!guide) {
    throw new Error('No Guide Context');
  }
  return guide;
}
export function useMyRefs() {
  const { refs } = useContext(StorageContext);
  if (!refs) {
    throw new Error('No Refc Context');
  }
  return refs;
}
export function useMyStats() {
  const { stats } = useContext(StorageContext);
  if (!stats) {
    throw new Error('No Refc Context');
  }
  return stats;
}
export function useMyMainButt() {
  const { mainButt } = useContext(StorageContext);
  if (!mainButt) {
    throw new Error('No Logic Context');
  }
  return mainButt;
}
