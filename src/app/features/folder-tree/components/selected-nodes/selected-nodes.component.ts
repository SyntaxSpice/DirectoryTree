import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FolderTreeService } from '@core/services/directory-tree.service';

@Component({
  selector: 'app-selected-nodes',
  templateUrl: './selected-nodes.component.html',
  imports: [CommonModule],
})
export class SelectedNodesComponent {
  constructor(private folderService: FolderTreeService) {}

  get selectedNodeIds() {
    return this.folderService.selectedNodes
      .map((node) => node.value.id)
      .sort()
      .join(', ');
  }
}
