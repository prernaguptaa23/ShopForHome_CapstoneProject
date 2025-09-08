import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistItemsComponent } from './wishlist-items';

describe('WishlistItems', () => {
  let component: WishlistItemsComponent;
  let fixture: ComponentFixture<WishlistItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WishlistItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishlistItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
