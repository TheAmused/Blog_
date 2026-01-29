import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, PaginationComponent], 
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  public posts: any[] = [];
  public selectedImage: string | null = null;
  
  public currentPage: number = 1;
  public itemsPerPage: number = 12;
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
        console.log('🔧 Brak parametrów w URL -> Przekierowuję na domyślne...');
        this.router.navigate(['/gallery'], {
          queryParams: { 
            page: 1, 
            limit: 12 
          }
        });
        return;
      }

      this.currentPage = Number(p);
      this.itemsPerPage = Number(l);
      
      console.log(`✅ URL OK: Page=${this.currentPage}, Limit=${this.itemsPerPage}`);

      this.getGalleryData();
    });
  }

  updateUrl(page: number, limit: number) {
    this.router.navigate(['/gallery'], {
      queryParams: { 
        page: page, 
        limit: limit 
      }
    });
  }

  onPageChange(page: number) {
    this.updateUrl(page, this.itemsPerPage);
  }
  onLimitChange(event: any) {
    const newLimit = Number(event.target.value);
    this.updateUrl(1, newLimit);
  }

  async getGalleryData() {
    try {
      const response = await lastValueFrom(
        this.service.getAll(this.currentPage, this.itemsPerPage, '')
      );
      
      if (response && response.items) {
        this.posts = response.items;
        this.totalItems = response.totalCount;
      } else if (Array.isArray(response)) {
        this.posts = response;
        this.totalItems = response.length;
      }
    } catch (error) {
      console.error('Błąd galerii:', error);
    }
  }

  openImage(image: string) {
    this.selectedImage = image;
  }

  closeImage() {
    this.selectedImage = null;
  }
}