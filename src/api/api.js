export const DATE_FORMAT = 'YYYY-MM-DD HH:mm';
export const API_URL = 'https://sandbox.parkpass.ru/api/v1/valet/session/';
export const MEDIA_URL = 'https://sandbox.parkpass.ru';

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

export const fixtures = {
  id: 147,
  state: 4,
  client_id: null,
  parking: {
    id: 103,
    name: 'Жилой Квартал Prime Park',
    address: 'Ленинградский просп., 37/5',
    city: 'Москва',
    picture: '/api/media/object_images/PrimeParkCover_uBmb3GA.jpg',
  },
  car_number: 'X555XX77',
  car_color: 'rgb(222, 222, 222)',
  car_model: 'Hyundai',
  debt: '0.00',
  valet_card_id: '666',
  pcid: null,
  parking_card: '2222222222',
  parking_place: '1 45',
  created_by_user: 17,
  responsible_for_reception: {
    id: 17,
    first_name: 'Владимир',
    last_name: 'Яковлев',
    middle_name: null,
    email: 'valetuser2@parkpass.ru',
    phone: '79818149287',
    role_id: 15,
    available_parking: [106, 103],
    company: 8,
    created_by_user: null,
    avatar: '/api/media/valet_users_avatars/0e537e46-847a-4f80-8286-be90efeeadcf.png',
  },
  responsible_for_delivery: null,
  parking_card_get_at: null,
  car_delivery_time: '2022-11-10T19:26:00Z',
  car_delivered_at: null,
  car_delivered_by: null,
  paid_at: null,
  parking_card_session: null,
  comment: '',
  started_at: '2022-06-15T15:44:00Z',
  duration: 0,
  request: {
    id: 203,
    status: 1,
    car_delivery_time: '2022-11-10T19:26:00Z',
    accepted_by: null,
    accepted_at: null,
    created_at: '2022-11-09T21:34:37.655800Z',
  },
  photos: [
    {
      id: 507,
      valet_session: 147,
      type: 2,
      created_at: '2022-06-15T15:45:30.776813Z',
      img: '/valet_car_photo/da41daf5-fad1-4626-b27b-4d2f28fb7f75.jpeg',
    },
    {
      id: 506,
      valet_session: 147,
      type: 2,
      created_at: '2022-06-15T15:45:30.763827Z',
      img: '/valet_car_photo/9cb6f396-4107-4f18-99bc-67e6b4785137.jpeg',
    },
    {
      id: 505,
      valet_session: 147,
      type: 2,
      created_at: '2022-06-15T15:45:30.732085Z',
      img: '/valet_car_photo/0e40d17d-db13-4f84-a0f0-3b0495690ea3.jpeg',
    },
    {
      id: 504,
      valet_session: 147,
      type: 2,
      created_at: '2022-06-15T15:45:29.746084Z',
      img: '/valet_car_photo/99d88879-2bb0-4e7f-bde4-c0d5a3f3f5db.jpeg',
    },
    {
      id: 503,
      valet_session: 147,
      type: 1,
      created_at: '2022-06-15T15:45:00.019933Z',
      img: '/valet_car_photo/b685bf00-c9d2-4ef5-9451-4ac4fa698459.jpeg',
    },
    {
      id: 502,
      valet_session: 147,
      type: 1,
      created_at: '2022-06-15T15:44:59.966669Z',
      img: '/valet_car_photo/c9cf10f3-f275-4a12-a40f-adb7f5a2c4db.jpeg',
    },
    {
      id: 501,
      valet_session: 147,
      type: 1,
      created_at: '2022-06-15T15:44:59.927111Z',
      img: '/valet_car_photo/f7cbc616-ab41-4246-a12b-05a4cf1ba69d.jpeg',
    },
    {
      id: 500,
      valet_session: 147,
      type: 1,
      created_at: '2022-06-15T15:44:59.512772Z',
      img: '/valet_car_photo/b4e8db23-a742-489a-b290-8c719c65822d.jpeg',
    },
  ],
};
