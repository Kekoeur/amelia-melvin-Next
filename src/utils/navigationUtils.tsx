import { NavigationItem } from "@/types/pages";

export const getFullRoute = (item: NavigationItem): string => {
    const parts: string[] = [];
    let current: NavigationItem | undefined = item;

    while (current) {
        parts.unshift(current.path);
        current = current.parent;
    }

    return parts.join("/");
};

export interface NavigationNode extends NavigationItem {
    children: NavigationNode[];
}
  
export function buildNavigationTree(flatItems: NavigationItem[]): NavigationNode[] {
    const itemMap = new Map<string, NavigationNode>();

    // Première passe : créer une copie de chaque élément avec un tableau children
    flatItems.forEach((item) => {
        itemMap.set(item.path, { ...item, children: [] });
    });

    const rootItems: NavigationNode[] = [];

    // Deuxième passe : assigner les enfants aux parents
    itemMap.forEach((item) => {
        if(item.menuAttached) {
            if (item.parent?.path) {
            const parentItem = itemMap.get(item.parent.path);
            if (parentItem) {
                parentItem.children.push(item);
            }
            } else {
            rootItems.push(item);
            }
        }
    });

    return rootItems;
}
  