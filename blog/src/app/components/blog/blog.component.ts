import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from "../../services/data.service";
import { BlogItemComponent } from "../blog-item/blog-item.component";
import { PaginationComponent } from '../../shared/pagination/pagination.component'; 
import { CommonModule } from "@angular/common";

@Component({
  selector: 'blog',
  standalone: true,
  imports: [
    BlogItemComponent, 
    CommonModule,     
    PaginationComponent
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit, OnChanges {
  @Input() filterText: string = '';
  
  public items: any[] = [];
  public totalItems: number = 0;

  public pageSize: number = 4; 
  public currentPage: number = 1;

  constructor(private service: DataService) {}

  ngOnInit() {
    this.getAll();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterText']) {
      this.currentPage = 1;
      this.getAll();
    }
  }

  getAll() {
    this.service.getAll(this.currentPage, this.pageSize, this.filterText)
      .subscribe(response => {
        this.items = response.items;
        this.totalItems = response.totalCount;
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}