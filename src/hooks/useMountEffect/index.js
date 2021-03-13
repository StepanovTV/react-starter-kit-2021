import { useEffect } from 'react';

// eslint-disable-next-line react-hooks/exhaustive-deps
const useMountEffect = (fun) => useEffect(fun, []);

export default useMountEffect;
