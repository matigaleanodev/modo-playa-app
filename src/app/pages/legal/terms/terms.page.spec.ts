import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TermsPage } from './terms.page';

describe('TermsPage', () => {
  let component: TermsPage;
  let fixture: ComponentFixture<TermsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar título legal en content', () => {
    const title = fixture.nativeElement.querySelector('.legal-page-title h1');
    expect((title as HTMLElement | null)?.textContent).toContain(
      'Terminos y condiciones',
    );
  });
});
