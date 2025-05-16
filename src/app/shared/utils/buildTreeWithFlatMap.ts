import { ITreeNode } from '@core/interfaces/tree-node.type';
import { sortByPath } from './sortBy';

type Entity<T extends string, D> = {
  columns: string[];
  data: Array<any>;
};

export type DataStructure = {
  folders: Entity<
    'id' | 'title' | 'parent_id',
    [number, string, number | null]
  >;
  items: Entity<'id' | 'title' | 'folder_id', [number, string, number]>;
};

export default function buildTreeWithFlatMap(json: DataStructure) {
  const folderCols = json.folders.columns;
  const itemCols = json.items.columns;

  const flatMap: { [key: number]: { value: ITreeNode } } = {};

  // Create folder NodeRefs
  const folderRefs = json.folders.data
    .map((row) => {
      const obj = Object.fromEntries(
        folderCols.map((key, idx) => [key, row[idx]])
      ) as ITreeNode;
      obj.viewId = `f${obj.id}`;
      obj.parentViewId = obj.parent_id ? `f${obj.parent_id}` : null;
      obj.children = [];
      obj.expanded = true;
      const nodeRef = { value: obj };
      flatMap[obj.viewId as any] = nodeRef;
      return nodeRef;
    })
    .sort(sortByPath('value.title'));

  // Create item NodeRefs
  const itemRefs = json.items.data
    .map((row) => {
      const obj = Object.fromEntries(
        itemCols.map((key, idx) => [key, row[idx]])
      ) as ITreeNode;
      obj.viewId = `i${obj.id}`;
      obj.parentViewId = obj.folder_id ? `f${obj.folder_id}` : null;
      const nodeRef = { value: obj };
      flatMap[obj.viewId as any] = nodeRef;
      return nodeRef;
    })
    .sort(sortByPath('value.title'));

  // Build folder map for nesting
  const folderMap = Object.fromEntries(
    folderRefs.map((ref) => [ref.value.viewId, ref])
  );

  // Nest folders under parents
  folderRefs.forEach((ref) => {
    const folder = ref.value;
    if (folder.parentViewId && folderMap[folder.parentViewId]) {
      folderMap[folder.parentViewId].value.children!.push(ref);
    }
  });

  // Nest items under folders
  itemRefs.forEach((ref) => {
    const item = ref.value;
    const parentFolder = folderMap[item.parentViewId!];
    if (parentFolder) {
      parentFolder.value.children!.push(ref);
    }
  });

  // Return top-level nodes
  const tree = folderRefs.filter((ref) => ref.value.parentViewId === null);

  return { tree, flatMap };
}
