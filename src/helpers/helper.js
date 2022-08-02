import { FortifyAPI } from '@peculiar/fortify-client-core';
import { Convert } from 'pvtsutils';
async function getProviders() {
  const api = new FortifyAPI();
  await api.start();
  const challenge = await api.challenge();
  if (challenge) {
    await api.login();
  }
  return api.getProviders();
}

async function getCertsByProviderId(id) {
  const api = new FortifyAPI();
  await api.start();
  const challenge = await api.challenge();
  if (challenge) {
    await api.login();
  }
  return api.getCertificatesByProviderId(id);
}

async function createSelfSignedCert() {
  const api = new FortifyAPI();
  await api.start();
  const challenge = await api.challenge();
  if (challenge) {
    await api.login();
  }
  return api.createX509('dde8304444a100c56673ad3d43e80a8fb13f20ca', {
    subjectName: 'testing',
    signatureAlgorithm: 'RSA-2048',
    hashAlgorithm: 'SHA-256',
  });
}

async function createCSR() {
  const api = new FortifyAPI();
  await api.start();
  const challenge = await api.challenge();
  if (challenge) {
    await api.login();
  }
  return api.createPKCS10('dde8304444a100c56673ad3d43e80a8fb13f20ca', {
    subjectName: 'testing',
    signatureAlgorithm: 'RSA-2048',
    hashAlgorithm: 'SHA-256',
  });
}

async function sign(providerId, certID, data) {
  const api = new FortifyAPI();
  await api.start();
  const challenge = await api.challenge();
  if (challenge) {
    await api.login();
  }
  const provider = await api.server.getCrypto(providerId);
  const key = await GetCertificateKey('private', provider, certID);
  if (!key) {
    throw new Error("Certificate doesn't have private key");
  }
  const alg = {
    name: key.algorithm.name,
    hash: 'SHA-256',
  };

  const message = Convert.FromUtf8String(data);

  const signature = await provider.subtle.sign(alg, key, message);
  const publicKey = await GetCertificateKey('public', provider, certID);

  const ok = await provider.subtle.verify(alg, publicKey, signature, message);

  return { ok, signature: Convert.ToHex(signature) };
}

async function GetCertificateKey(type, provider, certID) {
  const keyIDs = await provider.keyStorage.keys();
  for (const keyID of keyIDs) {
    const parts = keyID.split('-');

    if (parts[0] === type && parts[2] === certID.split('-')[2]) {
      const key = await provider.keyStorage.getItem(keyID);
      if (key) {
        return key;
      }
    }
  }
  if (type === 'public') {
    const cert = await provider.certStorage.getItem(certID);
    if (cert) {
      return cert.publicKey;
    }
  }
  return null;
}

export {
  getProviders,
  getCertsByProviderId,
  sign,
  createSelfSignedCert,
  createCSR,
};
