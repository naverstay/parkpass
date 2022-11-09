export const API_URL = 'https://sandbox.parkpass.ru/api/v1/valet/session/';

export const apiFetchPost = async (data, route) => {
  let response = await fetch(API_URL + route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });

  return await response.json();
};

export const apiFetchGet = async (route) => {
  return await fetch(API_URL + route).then((response) => response.json());
};
