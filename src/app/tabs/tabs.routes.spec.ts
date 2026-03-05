import { routes } from './tabs.routes';

describe('tabs.routes', () => {
  it('debería definir rutas hijas de tabs esperadas', () => {
    const tabsRoot = routes[0];
    const children = tabsRoot.children ?? [];
    const paths = children.map((route) => route.path);

    expect(paths).toContain('home');
    expect(paths).toContain('favoritos');
    expect(paths).toContain('destinos');
    expect(paths).toContain('');
  });
});
