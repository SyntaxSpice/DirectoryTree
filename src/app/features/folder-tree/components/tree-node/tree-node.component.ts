import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITreeNode } from '@core/interfaces/tree-node.type';
import { FolderTreeService } from '@core/services/directory-tree.service';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  imports: [CommonModule, NgIcon],
})
export class TreeNodeComponent implements OnChanges, AfterViewInit {
  @Input() node!: ITreeNode;
  @Input() level: number = 1;
  @ViewChild('checkbox') checkboxRef!: ElementRef<HTMLInputElement>;

  constructor(private treeService: FolderTreeService) {}

  ngOnChanges(): void {
    this.updateIndeterminate();
  }

  ngAfterViewInit() {
    this.updateIndeterminate();
  }

  private updateIndeterminate() {
    if (this.checkboxRef) {
      this.checkboxRef.nativeElement.indeterminate =
        this.node.indeterminate || false;
    }
  }

  public toggleSelection() {
    this.treeService.toggleChecked(this.node.viewId, !this.node.checked);
  }

  public toggleExpand(event: MouseEvent): void {
    event.stopPropagation();
    this.treeService.toggleExpand(this.node.viewId);
  }
}
