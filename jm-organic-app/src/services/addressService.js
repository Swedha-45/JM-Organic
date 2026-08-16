// services/addressService.js
//
// Addresses are scoped to a user uid. Today that's the Firebase auth uid
// read from AuthContext; the storage key just needs any stable user id.

const STORAGE_KEY = 'jm_addresses';

function readAll() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function writeAll(addresses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
}

export function getAddresses(uid) {
  return readAll().filter((a) => a.uid === uid);
}

export function addAddress(uid, address) {
  const addresses = readAll();
  const isFirst = addresses.filter((a) => a.uid === uid).length === 0;
  const newAddress = {
    ...address,
    id: `addr${Date.now()}`,
    uid,
    isDefault: isFirst, // first address for this user becomes default automatically
  };
  writeAll([...addresses, newAddress]);
  return newAddress;
}

export function updateAddress(id, updates) {
  const addresses = readAll().map((a) =>
    a.id === id ? { ...a, ...updates } : a
  );
  writeAll(addresses);
}

export function deleteAddress(id) {
  writeAll(readAll().filter((a) => a.id !== id));
}

export function setDefaultAddress(uid, id) {
  const addresses = readAll().map((a) => {
    if (a.uid !== uid) return a;
    return { ...a, isDefault: a.id === id };
  });
  writeAll(addresses);
}