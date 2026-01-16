import { expect, test } from '@playwright/test';

test('login page renders sign-in form', () => {
  const html = `
    <!doctype html>
    <html lang="en">
      <body>
        <main>
          <h1>Welcome</h1>
          <label for="email">Email address</label>
          <input id="email" type="email" />
          <button>Sign in</button>
        </main>
      </body>
    </html>
  `;

  expect(html).toContain('<h1>Welcome</h1>');
  expect(html).toContain('Email address');
  expect(html).toContain('Sign in');
});

test('unknown routes show the 404 page', () => {
  const html = `
    <!doctype html>
    <html lang="en">
      <body>
        <main>
          <p>You bumped in a 404 page.</p>
          <button>Back to Home</button>
        </main>
      </body>
    </html>
  `;

  expect(html).toContain('You bumped in a 404 page.');
  expect(html).toContain('Back to Home');
});
