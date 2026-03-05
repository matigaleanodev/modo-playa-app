import { routes } from './app.routes';

describe('app.routes', () => {
  it('debería definir rutas principales esperadas', () => {
    const paths = routes.map((route) => route.path);

    expect(paths).toContain('');
    expect(paths).toContain('lodging/:id');
    expect(paths).toContain('info');
    expect(paths).toContain('terms');
    expect(paths).toContain('privacy');
    expect(paths).toContain('**');
  });
});
