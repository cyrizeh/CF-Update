import { IconType } from 'react-icons';
import { Route } from './Route.type';

export interface SidebarItem {
  key: string;
  label: string;
  path: Route;
  icon?: IconType;
}
