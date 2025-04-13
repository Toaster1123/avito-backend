import { v4 as uuidv4 } from 'uuid';
type Category = {
  id: string;
  name: string;
  parentId: string | null;
};

export const categories: Category[] = [
  {
    id: '1',
    name: 'Транспорт',
    parentId: null,
  },
  {
    id: '2',
    name: 'Автомобили',
    parentId: '1',
  },
  {
    id: '3',
    name: 'Мотоциклы и мопеды',
    parentId: '1',
  },
  {
    id: '4',
    name: 'Грузовики и спецтехника',
    parentId: '1',
  },
  {
    id: '5',
    name: 'Водный транспорт',
    parentId: '1',
  },
  {
    id: '6',
    name: 'Запчасти и аксессуары',
    parentId: '1',
  },
  {
    id: '7',
    name: 'Недвижимость',
    parentId: null,
  },
  {
    id: '8',
    name: 'Квартиры',
    parentId: '7',
  },
  {
    id: '9',
    name: 'Дома, дачи, коттеджи',
    parentId: '7',
  },
  {
    id: '10',
    name: 'Земельные участки',
    parentId: '7',
  },
  {
    id: '11',
    name: 'Гаражи и стоянки',
    parentId: '7',
  },
  {
    id: '12',
    name: 'Коммерческая недвижимость',
    parentId: '7',
  },
  {
    id: '13',
    name: 'Электроника',
    parentId: null,
  },
  {
    id: '14',
    name: 'Телефоны',
    parentId: '13',
  },
  {
    id: '15',
    name: 'Компьютеры и комплектующие',
    parentId: '13',
  },
  {
    id: '16',
    name: 'Фото и видеотехника',
    parentId: '13',
  },
  {
    id: '17',
    name: 'Аудиотехника',
    parentId: '13',
  },
  {
    id: '18',
    name: 'Бытовая техника',
    parentId: null,
  },
  {
    id: '19',
    name: 'Холодильники и морозильники',
    parentId: '18',
  },
  {
    id: '20',
    name: 'Стиральные машины',
    parentId: '18',
  },
  {
    id: '21',
    name: 'Личные вещи',
    parentId: null,
  },
  {
    id: '22',
    name: 'Мужская одежда',
    parentId: '21',
  },
  {
    id: '23',
    name: 'Женская одежда',
    parentId: '21',
  },
  {
    id: '24',
    name: 'Детская одежда',
    parentId: '21',
  },
  {
    id: '25',
    name: 'Часы и украшения',
    parentId: '21',
  },
  {
    id: '26',
    name: 'Для дома и дачи',
    parentId: null,
  },
  {
    id: '27',
    name: 'Двери',
    parentId: '26',
  },
  {
    id: '28',
    name: 'Инструменты',
    parentId: '26',
  },
  {
    id: '29',
    name: 'Мебель',
    parentId: '26',
  },
  {
    id: '30',
    name: 'Растения',
    parentId: '26',
  },
  {
    id: '31',
    name: 'Посуда',
    parentId: '26',
  },
  {
    id: '32',
    name: 'Запчасти и аксессуары',
    parentId: null,
  },
  {
    id: '33',
    name: 'Для транспорта',
    parentId: '32',
  },
  {
    id: '34',
    name: 'Аудио и видео техника',
    parentId: '32',
  },
  {
    id: '35',
    name: 'Аксессуары',
    parentId: '32',
  },
  {
    id: '36',
    name: 'Инструменты',
    parentId: '32',
  },
  {
    id: '37',
    name: 'Прицепы',
    parentId: '32',
  },
  {
    id: '38',
    name: 'Масло',
    parentId: '32',
  },
  {
    id: '39',
    name: 'Животные',
    parentId: null,
  },
  {
    id: '40',
    name: 'Собаки',
    parentId: '39',
  },
  {
    id: '41',
    name: 'Кошки',
    parentId: '39',
  },
  {
    id: '42',
    name: 'Птицы',
    parentId: '39',
  },
  {
    id: '43',
    name: 'Аквариум',
    parentId: '39',
  },
  {
    id: '44',
    name: 'Другие животные',
    parentId: '39',
  },
  {
    id: '45',
    name: 'Товары для животных',
    parentId: '39',
  },
];

categories.forEach((category) => {
  category.id = uuidv4() as string;
  if (category.parentId) {
    category.parentId = uuidv4() as string;
  }
});
