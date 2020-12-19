declare module "vue-the-mask";
declare module "uuid";
declare module "bcryptjs";

export interface Author {
  id?: String;
  first_name?: String;
  last_name?: String;
  phone_number?: String;
  email?: String;
  avatar?: String;
  telegram?: String;
  pictures?: Picture[];
  __typename?: String;
}

export interface Picture {
  id?: String;
  title?: String;
  description?: String;
  image?: String;
  thumbnail?: String;
  category_id?: String;
  categorie?: Category;
  collection_id?: String;
  collection?: Collection;
  author_id?: String;
  author: Author;
  __typename?: String;
}

export interface Category {
  id?: String;
  name?: JSON;
  icon?: String;
  pictures?: Picture[];
  __typename?: String;
}

export interface Collection {
  id?: String;
  name?: String;
  icon?: String;
  banner?: String;
  pictures?: Picture[];
  __typename?: String;
}
