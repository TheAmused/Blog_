import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { BlogItemComponent } from '../blog-item/blog-item.component';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'blog',
  standalone: true,
  imports: [CommonModule, BlogItemComponent, SearchBarComponent, PaginationComponent],
  templateUrl: './blog-home.component.html',
  styleUrl: './blog-home.component.scss'
})
export class BlogHomeComponent implements OnInit {
  public filterText: string = '';
  public posts: any[] = [];
  
  public currentPage: number = 1;
  public itemsPerPage: number = 4;
  public totalItems: number = 0;
  
  public limitOptions: number[] = [4, 8, 12, 24];

  constructor(
    private service: DataService, 
    private route: ActivatedRoute, 
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const p = params['page'];
      const l = params['limit'];

      if (!p || !l) {
        console.log('🔧 Blog: Brak parametrów -> Wymuszam domyślne...');
        this.router.navigate(['/blog'], {
          queryParams: { 
            page: 1, 
            limit: 4 
          }
        });
        return; 
      }

      this.currentPage = Number(p);
      this.itemsPerPage = Number(l);

      console.log(`✅ Blog URL OK: Page=${this.currentPage}, Limit=${this.itemsPerPage}`);

      this.getAll();
    });
  }

  getName(name: string) {
    if (this.filterText === name) {
      return;
    }
    
    this.filterText = name;
    this.updateUrl(1, this.itemsPerPage);
  }

  onPageChange(page: number) {
    this.updateUrl(page, this.itemsPerPage);
  }

  onLimitChange(event: any) {
    const newLimit = Number(event.target.value);
    this.updateUrl(1, newLimit);
  }

  updateUrl(page: number, limit: number) {
    this.router.navigate(['/blog'], {
      queryParams: { page: page, limit: limit },
      queryParamsHandling: 'merge',
    });
  }

  async getAll() {
    try {
      const response = await lastValueFrom(
        this.service.getAll(this.currentPage, this.itemsPerPage, this.filterText)
      );

      if (response && response.items) {
        this.posts = response.items;
        this.totalItems = response.totalCount;
      } else if (Array.isArray(response)) {
        this.posts = response;
        this.totalItems = response.length;
      }
    } catch (error) {
      console.error('Błąd pobierania postów:', error);
    }
  }

  refreshPosts() {
    this.filterText = '';
    this.updateUrl(1, 4);
  }
}