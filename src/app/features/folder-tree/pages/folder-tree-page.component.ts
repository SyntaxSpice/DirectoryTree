import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNodeComponent } from '../components/tree-node/tree-node.component';
import { FolderTreeService } from '@core/services/directory-tree.service';
import { SelectedNodesComponent } from '../components/selected-nodes/selected-nodes.component';
import { INodeRef } from '@core/interfaces/tree-node.type';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-folder-tree-page',
  templateUrl: './folder-tree-page.component.html',
  imports: [
    CommonModule,
    TreeNodeComponent,
    SelectedNodesComponent,
    ButtonComponent,
  ],
})
export class FolderTreePageComponent implements OnInit {
  public tree: INodeRef[] = [];

  constructor(private folderService: FolderTreeService) {}

  ngOnInit(): void {
    this.folderService.loadTree().add(() => {
      this.tree = this.folderService.getTree();
    });
  }

  public clearSelection() {
    this.folderService.clearSelection();
  }
}
