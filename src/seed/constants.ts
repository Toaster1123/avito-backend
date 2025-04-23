import { v4 as uuidv4 } from 'uuid';
type Category = {
  id: string;
  name: string;
  parentId: string | null;
  parent: Category | null;
};

export const categories: Category[] = [
  {
    id: '1',
    name: 'Транспорт',
    parentId: null,
    parent: null,
  },
  {
    id: '2',
    name: 'Автомобили',
    parentId: '1',
    parent: null,
  },
  {
    id: '3',
    name: 'Мотоциклы и мопеды',
    parentId: '1',
    parent: null,
  },
  {
    id: '4',
    name: 'Грузовики и спецтехника',
    parentId: '1',
    parent: null,
  },
  {
    id: '5',
    name: 'Водный транспорт',
    parentId: '1',
    parent: null,
  },
  {
    id: '6',
    name: 'Запчасти и аксессуары',
    parentId: '1',
    parent: null,
  },
  {
    id: '7',
    name: 'Недвижимость',
    parentId: null,
    parent: null,
  },
  {
    id: '8',
    name: 'Квартиры',
    parentId: '7',
    parent: null,
  },
  {
    id: '9',
    name: 'Дома, дачи, коттеджи',
    parentId: '7',
    parent: null,
  },
  {
    id: '10',
    name: 'Земельные участки',
    parentId: '7',
    parent: null,
  },
  {
    id: '11',
    name: 'Гаражи и стоянки',
    parentId: '7',
    parent: null,
  },
  {
    id: '12',
    name: 'Коммерческая недвижимость',
    parentId: '7',
    parent: null,
  },
  {
    id: '13',
    name: 'Электроника',
    parentId: null,
    parent: null,
  },
  {
    id: '14',
    name: 'Телефоны',
    parentId: '13',
    parent: null,
  },
  {
    id: '15',
    name: 'Компьютеры и комплектующие',
    parentId: '13',
    parent: null,
  },
  {
    id: '16',
    name: 'Фото и видеотехника',
    parentId: '13',
    parent: null,
  },
  {
    id: '17',
    name: 'Аудиотехника',
    parentId: '13',
    parent: null,
  },
  {
    id: '18',
    name: 'Бытовая техника',
    parentId: null,
    parent: null,
  },
  {
    id: '19',
    name: 'Холодильники и морозильники',
    parentId: '18',
    parent: null,
  },
  {
    id: '20',
    name: 'Стиральные машины',
    parentId: '18',
    parent: null,
  },
  {
    id: '21',
    name: 'Личные вещи',
    parentId: null,
    parent: null,
  },
  {
    id: '22',
    name: 'Мужская одежда',
    parentId: '21',
    parent: null,
  },
  {
    id: '23',
    name: 'Женская одежда',
    parentId: '21',
    parent: null,
  },
  {
    id: '24',
    name: 'Детская одежда',
    parentId: '21',
    parent: null,
  },
  {
    id: '25',
    name: 'Часы и украшения',
    parentId: '21',
    parent: null,
  },
  {
    id: '26',
    name: 'Для дома и дачи',
    parentId: null,
    parent: null,
  },
  {
    id: '27',
    name: 'Двери',
    parentId: '26',
    parent: null,
  },
  {
    id: '28',
    name: 'Инструменты',
    parentId: '26',
    parent: null,
  },
  {
    id: '29',
    name: 'Мебель',
    parentId: '26',
    parent: null,
  },
  {
    id: '30',
    name: 'Растения',
    parentId: '26',
    parent: null,
  },
  {
    id: '31',
    name: 'Посуда',
    parentId: '26',
    parent: null,
  },
  {
    id: '32',
    name: 'Запчасти и аксессуары',
    parentId: null,
    parent: null,
  },
  {
    id: '33',
    name: 'Для транспорта',
    parentId: '32',
    parent: null,
  },
  {
    id: '34',
    name: 'Аудио и видео техника',
    parentId: '32',
    parent: null,
  },
  {
    id: '35',
    name: 'Аксессуары',
    parentId: '32',
    parent: null,
  },
  {
    id: '36',
    name: 'Инструменты',
    parentId: '32',
    parent: null,
  },
  {
    id: '37',
    name: 'Прицепы',
    parentId: '32',
    parent: null,
  },
  {
    id: '38',
    name: 'Масло',
    parentId: '32',
    parent: null,
  },
  {
    id: '39',
    name: 'Животные',
    parentId: null,
    parent: null,
  },
  {
    id: '40',
    name: 'Собаки',
    parentId: '39',
    parent: null,
  },
  {
    id: '41',
    name: 'Кошки',
    parentId: '39',
    parent: null,
  },
  {
    id: '42',
    name: 'Птицы',
    parentId: '39',
    parent: null,
  },
  {
    id: '43',
    name: 'Аквариум',
    parentId: '39',
    parent: null,
  },
  {
    id: '44',
    name: 'Другие животные',
    parentId: '39',
    parent: null,
  },
  {
    id: '45',
    name: 'Товары для животных',
    parentId: '39',
    parent: null,
  },
];

const idMap: Record<string, string> = {};
categories.forEach((category) => {
  idMap[category.id] = uuidv4();
});

categories.forEach((category) => {
  category.id = idMap[category.id];
  if (category.parentId) {
    category.parentId = idMap[category.parentId];
  }
});

categories.forEach((category) => {
  if (category.parentId) {
    category.parent =
      categories.find((c) => c.id === category.parentId) || null;
  }
});
