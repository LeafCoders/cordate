import { HasDisplayOrder } from '../server/rest-api.model';

export function moveItemByDisplayOrder(items: Array<HasDisplayOrder>, moveItem: HasDisplayOrder, toItem: HasDisplayOrder): void {
  items.forEach(item => {
    if (moveItem.displayOrder < toItem.displayOrder) {
      if (item.displayOrder >= moveItem.displayOrder && item.displayOrder <= toItem.displayOrder) {
        item.displayOrder -= 1;
      }
    } else {
      if (item.displayOrder >= toItem.displayOrder && item.displayOrder <= moveItem.displayOrder) {
        item.displayOrder += 1;
      }
    }
  });
  moveItem.displayOrder = toItem.displayOrder;
  items.sort((a, b) => a.displayOrder > b.displayOrder ? 1 : -1);
}
