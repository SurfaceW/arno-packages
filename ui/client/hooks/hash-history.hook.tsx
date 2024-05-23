import { useEffect, useState } from "react";


const pushHash = (hash: string) => {
  window.location.hash = hash;
};

const replaceHash = (hash: string) => {
  window.location.replace(`#${hash}`)
}

export const useHashHistory = () => {

  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const cb = () => {
      setCurrentHash(window.location.hash);
    };
    window.addEventListener('hashchange', cb);
    return () => {
      window.removeEventListener('hashchange', cb);
    }
  }, []);

  return {
    currentHash,
    pushHash,
    replaceHash
  }
}