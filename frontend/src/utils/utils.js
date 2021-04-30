export const networkCall = async ({ path = '', method = '', body = {} }) => {
  if (
    !['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH'].includes(method.toUpperCase())
  ) {
    throw new Error(`${method} is invalid CRUD method!`);
  }

  const controller = new AbortController();
  const { signal } = controller;
  const req = { method: method.toUpperCase(), headers: { 'Content-Type': 'application/json' }, signal };
  if (['POST', 'PUT', 'PATCH' /*, 'DELETE'*/].includes(method.toUpperCase())) {
    req.body = JSON.stringify(body);
  }

  const responseInfo = { done: false };
  const response = await Promise.race([
    fetch(path, req).then((res) => {
      responseInfo.done = true;
      return res.json();
    }),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ error: `Bad connection ('${path}')` });
        if (!responseInfo.done) {
          controller.abort();
        }
      }, 15000);
    }),
  ]);

  return response;
};

export const cancelEvent = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.nativeEvent) {
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    e.nativeEvent.stopPropagation();
  }
};
