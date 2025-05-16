export interface INodeRef {
  value: ITreeNode;
}

export interface ITreeNode {
  id: number;
  viewId: string;
  title: string;
  children?: INodeRef[];
  expanded?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  parent_id?: number;
  folder_id?: number;
  parentViewId: string | null;
}
