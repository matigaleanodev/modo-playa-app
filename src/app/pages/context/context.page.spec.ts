import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ContextPage } from './context.page';

describe('ContextPage', () => {
  let component: ContextPage;
  let fixture: ComponentFixture<ContextPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ContextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });
});
