export interface ItemsGroup<T> {
  title: string;
  data?: any;
  items: Array<T>;
}

type KEY = number | string;

export function itemsGrouper<T>(
  toGroupKeyFn: (item: T) => KEY,
  createGroupFn: (item: T) => ItemsGroup<T>,
  itemTransformFn: (item: T) => any,
  items: Array<T>
): Array<ItemsGroup<T>> {

  function addItem(item: T): void {
    let groupKey: KEY = toGroupKeyFn(item);
    let group: ItemsGroup<T> = getGroup(groupKey, item);
    group.items.push(itemTransformFn(item));
  };

  function getGroup(groupKey: KEY, item: T): ItemsGroup<T> {
    let group: ItemsGroup<T> = groups[groupKey];
    if (!group) {
      group = createGroupFn(item)
      groups[groupKey] = group;
    }
    return group;
  }

  let groups: { [groupKey: number]: ItemsGroup<T> } = {};
  items.forEach(addItem);
  return Object.keys(groups).map(key => groups[key]);
}

