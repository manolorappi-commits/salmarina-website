import site from "../../content/site.json";
import menu from "../../content/menu.json";
import menuVorschlaege from "../../content/menu-vorschlaege.json";
import news from "../../content/news.json";
import gallery from "../../content/gallery.json";
import wine from "../../content/wine.json";

export { site, menu, menuVorschlaege, news, gallery, wine };

export type Site = typeof site;
export type Menu = typeof menu;
export type MenuVorschlaege = typeof menuVorschlaege;
export type News = typeof news;
export type Gallery = typeof gallery;
export type Wine = typeof wine;
