import { useEffect, useState } from 'react';
import { getCertsByProviderId, getProviders, sign } from '../helpers/helper';

export default function ListCerts() {
  const [providers, setProviders] = useState([]);
  const [provider, setProvider] = useState('');
  const [cert, setCert] = useState('');
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    (async () => {
      const providers = await getProviders();
      setProviders(providers);
    })();
  }, []);

  const handleProviderChange = async (e) => {
    setCertificates([]);
    const certs = await getCertsByProviderId(e.target.value);
    setProvider(e.target.value);
    const certIDs = certs
      .filter(({ index: id }) => {
        const parts = id.split('-');
        return parts[0] === 'x509';
      })
      .map((cert) => cert.index);

    const keyIDs = certs
      .filter(({ privateKeyId: id }) => {
        const parts = id.split('-');
        return parts[0] === 'private';
      })
      .map((cert) => cert.privateKeyId);

    for (const certID of certIDs) {
      for (const keyID of keyIDs) {
        if (keyID.split('-')[2] === certID.split('-')[2]) {
          try {
            const cert = certs.find((cert) => cert.index === certID);
            setCertificates([
              ...certificates,
              {
                id: certID,
                item: cert,
              },
            ]);
          } catch (e) {
            console.error(
              `Cannot get certificate ${certID} from CertificateStorage. ${e.message}`
            );
          }
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const provider = e.target.provider.value;
    const certificate = e.target.certificate.value;
    const message = e.target.message.value;

    const { ok, signature } = await sign(provider, certificate, {
      data: message,
    });

    console.log({ ok, signature });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="group">
          <label htmlFor="providers">Providers:</label>
          <select
            id="providers"
            name="provider"
            onChange={handleProviderChange}
          >
            {providers.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
        <div className="group">
          <label htmlFor="certificates">Certificates:</label>
          <select id="certificates" name="certificate">
            {certificates.map((cert) => (
              <option value={cert.id} key={cert.id}>
                {cert.item.subjectName}
              </option>
            ))}
          </select>
        </div>
        <br />
        <br />
        <h2>Sign request</h2>

        <div className="group">
          <label htmlFor="message">Message:</label>
          <input
            id="message"
            type="text"
            name="message"
            defaultValue="Test message"
          ></input>
        </div>
        <div className="group">
          <button id="submit">send request</button>
        </div>
      </form>
    </div>
  );
}
