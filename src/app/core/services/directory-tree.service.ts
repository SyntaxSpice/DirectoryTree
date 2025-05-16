import { Injectable, OnInit } from '@angular/core';
import { INodeRef, ITreeNode } from '@core/interfaces/tree-node.type';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import buildTreeWithFlatMap, {
  DataStructure,
} from '@shared/utils/buildTreeWithFlatMap';

@Injectable({ providedIn: 'root' })
export class FolderTreeService {
  private tree: INodeRef[] = [];
  private flatMap: Record<string, INodeRef> = {};
  public selectedNodes: INodeRef[] = [];

  constructor(private apiService: ApiService) {}

  public getTree(): INodeRef[] {
    return this.tree;
  }

  public loadTree() {
    return this.fetchDirectory().subscribe({
      next: (res) => {
        const { tree, flatMap } = buildTreeWithFlatMap(res);
        this.tree = tree;
        this.flatMap = flatMap;
      },
    });
  }

  public fetchDirectory(): Observable<DataStructure> {
    return this.apiService.get(`mock_data/response.json`);
  }

  getSelectedNodes(): INodeRef[] {
    let selected = [];
    for (let ref in this.flatMap) {
      const node = this.flatMap[ref];
      if (node.value.checked && !node.value.children) {
        selected.push(node);
      }
    }
    return selected;
  }

  public clearSelection() {
    this.tree.forEach((node) => {
      this.toggleChecked(node.value.viewId, false);
    });
  }

  public toggleExpand(nodeId: string): void {
    const ref = this.flatMap[nodeId];
    if (!ref) return;

    ref.value = {
      ...ref.value,
      expanded: !ref.value.expanded,
    };
  }

  public toggleChecked(nodeId: string, checked: boolean): void {
    const nodeRef = this.flatMap[nodeId];
    if (!nodeRef) return;

    this.updateChildrenSelection(nodeRef, checked);
    this.updateParentSelection(this.findParent(nodeRef.value));
    this.selectedNodes = this.getSelectedNodes();
  }

  private updateChildrenSelection(ref: INodeRef, checked: boolean): void {
    ref.value = {
      ...ref.value,
      checked,
      indeterminate: false,
      children: ref.value.children?.map((childRef) => {
        this.updateChildrenSelection(childRef, checked);
        return childRef;
      }),
    };
  }

  private updateParentSelection(node: INodeRef | null): void {
    if (!node) return;

    const children = node.value.children!.map((c) => c.value);
    const allChecked = children.every((c) => c.checked);
    const noneChecked = children.every((c) => !c.checked && !c.indeterminate);

    const newValue: ITreeNode = {
      ...node.value,
      checked: allChecked,
      indeterminate: !allChecked && !noneChecked,
    };

    node.value = newValue;

    this.updateParentSelection(this.findParent(newValue));
  }

  private findParent(child: ITreeNode): INodeRef | null {
    return child.parentViewId ? this.flatMap[child.parentViewId] : null;
  }
}
