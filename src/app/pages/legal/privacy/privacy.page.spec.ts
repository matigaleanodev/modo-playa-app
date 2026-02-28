import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PrivacyPage } from './privacy.page';

describe('PrivacyPage', () => {
  let component: PrivacyPage;
  let fixture: ComponentFixture<PrivacyPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería renderizar título legal en content', () => {
    const title = fixture.nativeElement.querySelector('.legal-page-title h1');
    expect((title as HTMLElement | null)?.textContent).toContain(
      'Politica de privacidad',
    );
  });
});
