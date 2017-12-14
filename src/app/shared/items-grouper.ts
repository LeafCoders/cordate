export interface ItemsGroup<T> {
  title: string;
  data?: any;
  items: Array<T>;
}

export function itemsGrouper<T>(
  compareFn: (T) => any,
  toGroupFn: (T) => ItemsGroup<T>,
  itemTransformFn: (T) => any,
  items: Array<T>
): Array<ItemsGroup<T>> {

  function addItem(item: T): void {
    let value: number = compareFn(item);
    let group: ItemsGroup<T> = getGroup(value, item);
    group.items.push(itemTransformFn(item));
  };

  function getGroup(groupValue: number, item: T): ItemsGroup<T> {
    let group: ItemsGroup<T> = groups[groupValue];
    if (!group) {
      group = toGroupFn(item)
      groups[groupValue] = group;
    }
    return group;
  }

  let groups: { [groupValue: number]: ItemsGroup<T> } = {};
  items.forEach(addItem);
  return Object.keys(groups).map((key) => groups[key]);
}

