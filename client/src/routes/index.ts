import {ILink} from "../interface/IApp";
import {estimateIcon, mainIcon, settingsIcon} from "../assets/icons/icons";

export const links: ILink[] = [
    {path: '/', bg: '#1F3A5F', name: 'Главная', icon: mainIcon},
    {path: '/estimates', bg: '#1F3A5F', name: 'Сметы', icon: estimateIcon},
    {path: '/estimate-settings', bg: '#1F3A5F', name: 'Настройки', icon: settingsIcon},
]